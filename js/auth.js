/*
 * auth.js — 브라우저 localStorage만으로 동작하는 회원/로그인 모듈
 *
 * 서버가 없는 실습 페이지라 회원 정보와 로그인 상태를 브라우저에 저장한다.
 * 저장 위치는 origin 단위라 같은 호스트(file:// 또는 localhost)의 모든 페이지가 공유한다.
 *
 * ※ 실습용이므로 비밀번호를 그대로 저장한다. 실제 서비스라면 서버에서
 *   해시로 검증해야 하며, 브라우저에 비밀번호를 두면 안 된다.
 *
 * 페이지에서 쓰는 법
 *   <script src="../js/auth.js"></script>
 *   <div id="auth-area"></div>                     → 로그인/로그아웃 버튼이 자동으로 그려진다
 *   <span data-personal="name" data-fallback="게스트"></span>  → 로그인 사용자 값으로 채워진다
 *   <div data-auth="in">...</div>                  → 로그인 상태에서만 보인다
 *   <div data-auth="out">...</div>                 → 비로그인 상태에서만 보인다
 */
(function () {
    "use strict";

    var USERS_KEY = "skala:users";
    var SESSION_KEY = "skala:session";

    /* ── 저장소 ─────────────────────────────── */

    function read(key, fallback) {
        try {
            var raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) {
            // 사생활 보호 모드 등으로 localStorage를 못 쓰는 경우
            return fallback;
        }
    }

    function write(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            return false;
        }
    }

    function getUsers() {
        return read(USERS_KEY, {});
    }

    function getUser(userId) {
        return getUsers()[userId] || null;
    }

    function saveUser(user) {
        var users = getUsers();
        var prev = users[user.userId] || {};
        users[user.userId] = Object.assign({}, prev, user);
        write(USERS_KEY, users);
        return users[user.userId];
    }

    function login(userId, password) {
        var user = getUser(userId);
        if (!user) return { ok: false, reason: "등록되지 않은 아이디입니다." };
        if (user.password !== password) return { ok: false, reason: "비밀번호가 일치하지 않습니다." };
        write(SESSION_KEY, { userId: userId, loginAt: new Date().toISOString() });
        return { ok: true, user: user };
    }

    function logout() {
        try { localStorage.removeItem(SESSION_KEY); } catch (e) { /* 무시 */ }
    }

    function getSession() {
        return read(SESSION_KEY, null);
    }

    function currentUser() {
        var session = getSession();
        return session ? getUser(session.userId) : null;
    }

    /* ── 코드값 → 화면 표기 ──────────────────── */

    var GENDER_LABEL = { male: "남성", female: "여성", none: "선택안함" };
    var INTEREST_LABEL = {
        frontend: "웹 프론트엔드 (Vue.js / HTML)",
        uiux: "UI/UX 디자인 표준",
        backend: "백엔드 & 데이터베이스",
        cloud: "클라우드 & 인프라"
    };
    var ROUTE_LABEL = {
        friend: "지인 추천",
        search: "검색 엔진",
        sns: "SNS 광고",
        school: "학교 / 기관 안내",
        etc: "기타"
    };

    // 앞 글자의 받침 유무로 조사를 고른다. pair = [받침O, 받침X] 예: ["을","를"]
    function pickJosa(word, pair) {
        if (!word) return pair[1];
        var code = word.charCodeAt(word.length - 1);
        // 한글 음절(가~힣)이 아니면 받침 없는 쪽으로 둔다
        if (code < 0xAC00 || code > 0xD7A3) return pair[1];
        return (code - 0xAC00) % 28 !== 0 ? pair[0] : pair[1];
    }

    function formatBirth(value) {
        if (!value) return "";
        var p = value.split("-");
        return p.length === 3 ? p[0] + "년 " + Number(p[1]) + "월 " + Number(p[2]) + "일" : value;
    }

    // data-personal 이름 → 사용자 정보에서 꺼낸 표시용 문자열
    function field(user, key) {
        if (!user) return "";
        switch (key) {
            case "name":      return user.name || user.userId || "";
            case "userId":    return user.userId || "";
            case "email":     return user.email || "";
            case "birth":     return formatBirth(user.birth);
            case "gender":    return GENDER_LABEL[user.gender] || "";
            case "route":     return ROUTE_LABEL[user.route] || "";
            case "intro":     return user.intro || "";
            case "interests":
                var list = user.interests || [];
                return list.map(function (i) { return INTEREST_LABEL[i] || i; }).join(", ");
            case "loginAt":
                var s = getSession();
                return s ? new Date(s.loginAt).toLocaleString("ko-KR") : "";
            default:          return user[key] || "";
        }
    }

    /* ── 화면 반영 ──────────────────────────── */

    var STYLE = [
        ".auth-area{position:fixed;top:22px;right:24px;z-index:10;display:flex;align-items:center;gap:10px;",
        "animation:authIn .9s .3s ease both}",
        "@keyframes authIn{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}",
        ".auth-btn{display:inline-flex;align-items:center;gap:7px;padding:11px 22px;border-radius:999px;",
        "border:none;font-family:inherit;font-size:.88rem;font-weight:700;cursor:pointer;text-decoration:none;",
        "transition:transform .2s ease,box-shadow .2s ease,background .2s ease}",
        ".auth-btn--primary{color:#fff;background:linear-gradient(90deg,#7c5cff,#00d4ff);",
        "box-shadow:0 8px 26px rgba(124,92,255,.4)}",
        ".auth-btn--primary:hover{transform:translateY(-3px) scale(1.04);box-shadow:0 14px 38px rgba(124,92,255,.55)}",
        ".auth-btn--ghost{color:#e8e8f0;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14);",
        "backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}",
        ".auth-btn--ghost:hover{transform:translateY(-3px);background:rgba(255,92,138,.14);",
        "border-color:rgba(255,92,138,.45)}",
        ".auth-btn:active{transform:translateY(0) scale(.99)}",
        ".auth-who{display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:999px;",
        "font-size:.85rem;font-weight:700;color:#e8e8f0;background:rgba(255,255,255,.06);",
        "border:1px solid rgba(255,255,255,.12);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}",
        ".auth-who .dot{width:7px;height:7px;border-radius:50%;background:#4ade80;box-shadow:0 0 10px #4ade80}",
        ".is-guest{color:#9a9ab0;font-style:italic}",
        "@media(max-width:560px){.auth-area{top:14px;right:14px;gap:6px}",
        ".auth-btn,.auth-who{padding:8px 14px;font-size:.78rem}}"
    ].join("");

    function injectStyle() {
        if (document.getElementById("auth-style")) return;
        var s = document.createElement("style");
        s.id = "auth-style";
        s.textContent = STYLE;
        document.head.appendChild(s);
    }

    // 현재 페이지 기준으로 html 폴더 안의 다른 페이지 경로를 만든다
    function pageHref(file) {
        return file;
    }

    function renderAuthArea() {
        var box = document.getElementById("auth-area");
        if (!box) return;
        box.className = "auth-area";

        var user = currentUser();
        if (user) {
            box.innerHTML =
                '<span class="auth-who"><span class="dot"></span>' +
                escapeHtml(field(user, "name")) + "님</span>" +
                '<button type="button" class="auth-btn auth-btn--ghost" id="auth-logout">로그아웃</button>';
            document.getElementById("auth-logout").addEventListener("click", function () {
                logout();
                location.reload();
            });
        } else {
            box.innerHTML =
                '<a class="auth-btn auth-btn--ghost" href="' + pageHref("logIn.html") + '">🔑 로그인</a>' +
                '<a class="auth-btn auth-btn--primary" href="' + pageHref("signUp.html") + '">✍️ 회원가입</a>';
        }
    }

    function escapeHtml(s) {
        var d = document.createElement("div");
        d.textContent = s;
        return d.innerHTML;
    }

    // data-personal / data-auth 속성을 훑어 로그인 상태를 화면에 반영한다
    function applyPersonalization() {
        var user = currentUser();

        document.querySelectorAll("[data-personal]").forEach(function (el) {
            var value = field(user, el.dataset.personal);
            var fallback = el.dataset.fallback || "";
            el.textContent = value || fallback;
            el.classList.toggle("is-guest", !value);
        });

        // 앞 글자가 채워진 뒤에 조사를 맞춘다 (예: 장상민을 / 철수를)
        document.querySelectorAll("[data-josa]").forEach(function (el) {
            var pair = el.dataset.josa.split("/");
            var prev = el.previousElementSibling;
            el.textContent = pickJosa(prev ? prev.textContent.trim() : "", pair);
        });

        document.querySelectorAll("[data-auth='in']").forEach(function (el) {
            el.hidden = !user;
        });
        document.querySelectorAll("[data-auth='out']").forEach(function (el) {
            el.hidden = !!user;
        });
    }

    function refresh() {
        renderAuthArea();
        applyPersonalization();
    }

    /* ── 공개 API ───────────────────────────── */

    window.Auth = {
        getUsers: getUsers,
        getUser: getUser,
        saveUser: saveUser,
        login: login,
        logout: logout,
        getSession: getSession,
        currentUser: currentUser,
        field: field,
        refresh: refresh,
        labels: { gender: GENDER_LABEL, interest: INTEREST_LABEL, route: ROUTE_LABEL }
    };

    document.addEventListener("DOMContentLoaded", function () {
        injectStyle();
        refresh();
    });

    // 다른 탭에서 로그인/로그아웃하면 이 탭도 따라간다
    window.addEventListener("storage", function (e) {
        if (e.key === SESSION_KEY || e.key === USERS_KEY) refresh();
    });
})();
