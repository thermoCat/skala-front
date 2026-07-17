/*
 * auth.js — 브라우저 localStorage만으로 동작하는 회원/로그인 모듈
 *
 * 서버가 없는 실습 페이지라 회원 정보와 로그인 상태를 브라우저에 저장한다.
 * 저장 위치는 origin 단위라 같은 호스트(file:// 또는 localhost)의 모든 페이지가 공유한다.
 *
 * ※ 비밀번호는 SHA-256 해시(passwordHash)만 저장하고 평문은 어디에도 남기지 않는다.
 *   그래도 서버 없는 클라이언트 저장이라는 한계는 그대로다 — 실제 서비스라면
 *   반드시 서버 쪽에서 salt를 더한 해시로 검증해야 한다.
 *
 * 페이지에서 쓰는 법
 *   <script src="../js/core/auth.js"></script>
 *   <div id="auth-area"></div>                     → 로그인/로그아웃 버튼이 자동으로 그려진다
 *   <span data-personal="name" data-fallback="게스트"></span>  → 로그인 사용자 값으로 채워진다
 *   <div data-auth="in">...</div>                  → 로그인 상태에서만 보인다
 *   <div data-auth="out">...</div>                 → 비로그인 상태에서만 보인다
 */
(function () {
    "use strict";

    var USERS_KEY = "skala:users";
    var SESSION_KEY = "skala:session";

    // 아이디: 영문/숫자 4~15자. 비밀번호: 영문+숫자를 포함한 8~20자(특수문자 허용).
    // 회원가입 폼(html/signUp.html)의 input pattern과 반드시 같은 규칙을 쓴다.
    var USER_ID_PATTERN = /^[A-Za-z0-9]{4,15}$/;
    var PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9!@#$%^&*()_\-+=]{8,20}$/;

    /* ── 비밀번호 해시 (SHA-256) ────────────────
     * 비밀번호는 절대 평문으로 저장하지 않고, SHA-256 해시만 localStorage에 남긴다.
     * crypto.subtle은 보안 컨텍스트(HTTPS 또는 localhost)에서만 동작한다. */
    function sha256Hex(text) {
        var data = new TextEncoder().encode(text);
        return crypto.subtle.digest("SHA-256", data).then(function (buf) {
            return Array.prototype.map.call(new Uint8Array(buf), function (b) {
                return b.toString(16).padStart(2, "0");
            }).join("");
        });
    }

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
            return { ok: true };
        } catch (e) {
            // 사진을 여러 장 올리면 저장 공간이 찰 수 있어 원인을 구분해 돌려준다
            var full = e && (e.name === "QuotaExceededError" ||
                             e.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
                             e.code === 22 || e.code === 1014);
            return { ok: false, full: !!full };
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

    /* ── 여행 앨범 (사진+영상+음악 묶음) ───── */
    // 용량이 커서 회원 정보와 따로 보관한다 (회원 저장 때마다 같이 직렬화되면 느려진다)

    function albumsKey(userId) {
        return "skala:albums:" + userId;
    }

    // 모든 회원이 기본으로 갖는 SKALA 예시 앨범. 새 계정은 물론, 예전부터 있던
    // 계정도 앨범을 한 번도 손대지 않았다면 처음 조회하는 시점에 심어준다.
    // 회원이 지우고 나면(=저장 기록이 생기면) 다시 심지 않는다.
    function defaultAlbum(userId) {
        return {
            id: "default-skala-" + userId,
            title: "SKALA 캠퍼스 여행",
            content: "SKALA와 함께한 하루를 사진·영상·노래로 담았습니다.",
            photos: [
                { src: "../media/skala-banner.jpg", alt: "AI 시대, 미래 인재로 성장하는 길 - SKALA (SK AI Leader Academy) 배너" },
                { src: "../media/sk-logo.png", alt: "SK 로고" }
            ],
            thumbnailIndex: 0,
            audio: { src: "../media/skala-song.mp3", type: "audio/mpeg" },
            video: { src: "../media/skala-vlog.mp4", type: "video/mp4" },
            addedAt: new Date().toISOString()
        };
    }

    function getAlbums(userId) {
        if (!userId) return [];
        var albums = read(albumsKey(userId), null);
        if (albums === null) {
            albums = [defaultAlbum(userId)];
            write(albumsKey(userId), albums);
        }
        return albums;
    }

    function saveAlbums(userId, albums) {
        if (!userId) return { ok: false };
        return write(albumsKey(userId), albums);
    }

    /* ── 휴일 계획 ─────────────────────────── */

    function holidaysKey(userId) {
        return "skala:holidays:" + userId;
    }

    function getHolidays(userId) {
        return userId ? read(holidaysKey(userId), []) : [];
    }

    function saveHolidays(userId, plans) {
        if (!userId) return { ok: false };
        return write(holidaysKey(userId), plans);
    }

    /* ── 개인 메모 ─────────────────────────── */

    function memosKey(userId) {
        return "skala:memos:" + userId;
    }

    function getMemos(userId) {
        return userId ? read(memosKey(userId), []) : [];
    }

    function saveMemos(userId, memos) {
        if (!userId) return { ok: false };
        return write(memosKey(userId), memos);
    }

    /* ── 내 가방 물품 ──────────────────────── */

    function bagKey(userId) {
        return "skala:bag:" + userId;
    }

    function getBagItems(userId) {
        return userId ? read(bagKey(userId), []) : [];
    }

    function saveBagItems(userId, items) {
        if (!userId) return { ok: false };
        return write(bagKey(userId), items);
    }

    // 비밀번호 해시 비교가 비동기라 login도 Promise를 돌려준다.
    function login(userId, password) {
        var user = getUser(userId);
        if (!user) return Promise.resolve({ ok: false, reason: "등록되지 않은 아이디입니다." });
        return sha256Hex(password).then(function (hash) {
            if (user.passwordHash !== hash) return { ok: false, reason: "비밀번호가 일치하지 않습니다." };
            write(SESSION_KEY, { userId: userId, loginAt: new Date().toISOString() });
            return { ok: true, user: user };
        });
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
    var CLASS_LABEL = { "1": "1반 (201호)", "2": "2반 (202호)", "3": "3반 (204호)", "4": "4반 (205호)" };

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
            case "classNo":   return CLASS_LABEL[user.classNo] || "";
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
        // display를 지정한 요소(예: display:grid인 메뉴)는 hidden 속성만으로 숨겨지지 않는다.
        // data-auth로 숨긴 영역이 새어 나오지 않도록 여기서 확실히 막는다.
        "[hidden]{display:none !important}",
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
                // 개인 정보가 있는 페이지에 남지 않도록 메인 Hub로 보낸다
                location.href = pageHref("index.html");
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

        // 값이 있든 없든 글꼴은 주변 텍스트와 같아야 하므로 스타일은 건드리지 않는다
        document.querySelectorAll("[data-personal]").forEach(function (el) {
            var value = field(user, el.dataset.personal);
            el.textContent = value || el.dataset.fallback || "";
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
        // 목록처럼 속성만으로 못 그리는 부분은 각 페이지가 이 이벤트를 듣고 다시 그린다
        document.dispatchEvent(new CustomEvent("auth:change", { detail: { user: currentUser() } }));
    }

    /* ── 번호가 붙은 입력칸 다루기 ───────────── */
    // 좋아하는 것, 할 일처럼 칸을 정해두고 받는 항목을 읽고 쓴다.
    // 예: like1, like2, like3 → ["바이크", "야식"]  (빈 칸은 건너뛴다)

    function collectSlots(form, prefix, count) {
        var out = [];
        for (var i = 1; i <= count; i++) {
            var el = form.elements[prefix + i];
            var value = el ? el.value.trim() : "";
            if (value) out.push(value);
        }
        return out;
    }

    // 단어와 설명이 짝을 이루는 칸을 읽는다. 단어가 비면 그 줄은 건너뛴다.
    function collectPairs(form, termPrefix, descPrefix, count) {
        var out = [];
        for (var i = 1; i <= count; i++) {
            var termEl = form.elements[termPrefix + i];
            var descEl = form.elements[descPrefix + i];
            var term = termEl ? termEl.value.trim() : "";
            if (!term) continue;
            out.push({ term: term, desc: descEl ? descEl.value.trim() : "" });
        }
        return out;
    }

    // 저장된 값을 다시 칸에 채워 넣는다 (수정 창에서 사용)
    function fillSlots(form, prefix, values, count) {
        values = values || [];
        for (var i = 1; i <= count; i++) {
            var el = form.elements[prefix + i];
            if (el) el.value = values[i - 1] || "";
        }
    }

    function fillPairs(form, termPrefix, descPrefix, pairs, count) {
        pairs = pairs || [];
        for (var i = 1; i <= count; i++) {
            var pair = pairs[i - 1] || { term: "", desc: "" };
            var termEl = form.elements[termPrefix + i];
            var descEl = form.elements[descPrefix + i];
            if (termEl) termEl.value = pair.term || "";
            if (descEl) descEl.value = pair.desc || "";
        }
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
        collectSlots: collectSlots,
        collectPairs: collectPairs,
        fillSlots: fillSlots,
        fillPairs: fillPairs,
        getAlbums: getAlbums,
        saveAlbums: saveAlbums,
        getHolidays: getHolidays,
        saveHolidays: saveHolidays,
        getMemos: getMemos,
        saveMemos: saveMemos,
        getBagItems: getBagItems,
        saveBagItems: saveBagItems,
        hashPassword: sha256Hex,
        patterns: { userId: USER_ID_PATTERN, password: PASSWORD_PATTERN },
        labels: { gender: GENDER_LABEL, interest: INTEREST_LABEL, route: ROUTE_LABEL, classNo: CLASS_LABEL }
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
