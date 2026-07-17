/*
 * alarms.js — 브라우저 알림(Notification API) + 캘린더(.ics) 내보내기
 *
 * ⚠️ 근본적인 한계: 이 사이트는 서버가 없는 정적 페이지다. 그래서 브라우저 알림은
 *   "이 사이트의 페이지가 어딘가에 열려 있는 동안"에만 울린다. 브라우저를 완전히
 *   껐거나, 컴퓨터가 잠들어 있거나, 이 사이트 탭이 하나도 열려 있지 않으면 당연히
 *   울리지 않는다 — 이건 서버나 앱이 있어야 해결되는 문제라 프론트엔드만으로는
 *   피할 수 없다.
 *
 * 그래서 이 모듈은 두 가지를 함께 제공한다.
 *   1) 브라우저 알림: 평일 08:50(입실 10분 전) / 17:50(퇴실 10분 전)에 자동으로,
 *      그리고 휴일 계획에 시간을 정해두면 그 시각에 자동으로 알림을 띄운다.
 *      (탭이 열려 있는 동안만 동작 — 위 한계 참고)
 *   2) .ics 캘린더 파일: 맥 캘린더 / 아웃룩 / 구글 캘린더에 한 번 추가해두면,
 *      브라우저를 켜두지 않아도 그 앱이 알아서 알림을 울려준다. 이게 더 확실한 방법이다.
 *
 * 페이지에서 쓰는 법
 *   <script src="../js/core/auth.js"></script>
 *   <script src="../js/features/alarms.js"></script>
 *   Alarms.requestPermission()      → 알림 권한을 묻는다 (버튼 클릭 등 사용자 동작 안에서 호출)
 *   Alarms.permission()             → "granted" | "denied" | "default" | "unsupported"
 *   Alarms.fire(title, body, tag)   → 지금 바로 알림을 띄운다 (테스트용으로도 쓴다)
 *   Alarms.downloadICS(plan)        → { date:"YYYY-MM-DD", time:"HH:MM"(선택), title, content }
 *                                      한 건을 .ics로 내려받는다
 *   Alarms.downloadFixedICS()       → 평일 08:50/17:50 입실·퇴실 알림을 반복 일정 .ics로 내려받는다
 */
(function () {
    "use strict";

    var CHECK_INTERVAL_MS = 20000; // 20초마다 확인 (탭이 열려 있는 동안만 동작)

    var FIXED_ALARMS = [
        { id: "checkin", time: "08:50", title: "🔔 입실 체크 알림", body: "9시 수업 10분 전입니다. 입실을 확인해 주세요." },
        { id: "checkout", time: "17:50", title: "🔔 퇴실 체크 알림", body: "18시 종료 10분 전입니다. 퇴실을 확인해 주세요." }
    ];

    function pad(n) { return String(n).padStart(2, "0"); }
    function localDateKey(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
    function localTimeKey(d) { return pad(d.getHours()) + ":" + pad(d.getMinutes()); }

    /* ── 브라우저 알림 ──────────────────────── */

    function hasNotificationSupport() {
        return typeof Notification !== "undefined";
    }

    function permission() {
        return hasNotificationSupport() ? Notification.permission : "unsupported";
    }

    function requestPermission() {
        if (!hasNotificationSupport()) return Promise.resolve("unsupported");
        return Notification.requestPermission();
    }

    function fire(title, body, tag) {
        if (!hasNotificationSupport() || Notification.permission !== "granted") return false;
        try {
            new Notification(title, { body: body, tag: tag });
            return true;
        } catch (e) {
            // 일부 환경(예: 알림을 지원하지 않는 임베디드 브라우저)에서 생성 자체가 실패할 수 있다
            return false;
        }
    }

    // 같은 알림이 하루에 한 번만 울리도록, 마지막으로 울린 날짜를 저장해 둔다
    function firedToday(tag) {
        return localStorage.getItem("skala:alarm:" + tag) === localDateKey(new Date());
    }
    function markFired(tag, now) {
        localStorage.setItem("skala:alarm:" + tag, localDateKey(now));
    }

    // api.fire를 통해 부르면, 테스트에서 Alarms.fire를 바꿔치기했을 때도
    // (권한이 없어 실제 알림을 못 띄우는 환경에서) 시간 판정 로직만 따로 검증할 수 있다.
    function checkFixedAlarms(now) {
        var day = now.getDay(); // 0=일 6=토
        if (day === 0 || day === 6) return; // 수업 없는 주말은 건너뛴다
        var hhmm = localTimeKey(now);
        FIXED_ALARMS.forEach(function (a) {
            if (hhmm === a.time && !firedToday(a.id)) {
                if (api.fire(a.title, a.body, a.id)) markFired(a.id, now);
            }
        });
    }

    function checkHolidayAlarms(now) {
        var user = window.Auth && Auth.currentUser();
        if (!user) return;
        var plans = Auth.getHolidays(user.userId) || [];
        var today = localDateKey(now);
        var hhmm = localTimeKey(now);
        plans.forEach(function (p) {
            if (!p.time || p.date !== today || p.time !== hhmm) return;
            var tag = "holiday-" + p.id;
            if (!firedToday(tag)) {
                if (api.fire("📌 " + p.title, p.content || "예정된 일정 시간입니다.", tag)) markFired(tag, now);
            }
        });
    }

    function checkNow(now) {
        now = now || new Date();
        checkFixedAlarms(now);
        checkHolidayAlarms(now);
    }

    var timer = null;
    function start() {
        checkNow();
        if (timer) clearInterval(timer);
        timer = setInterval(function () { checkNow(); }, CHECK_INTERVAL_MS);
    }

    document.addEventListener("DOMContentLoaded", start);

    /* ── .ics 캘린더 파일 만들기 (RFC 5545) ───── */

    function icsEscape(text) {
        return String(text || "")
            .replace(/\\/g, "\\\\")
            .replace(/;/g, "\\;")
            .replace(/,/g, "\\,")
            .replace(/\n/g, "\\n");
    }

    // 한 줄이 너무 길면 규격대로 접는다. 한글은 UTF-8에서 한 글자에 3바이트라
    // 20자마다 끊으면 60바이트로, 규격 상한(75바이트)에 넉넉히 못 미친다.
    function foldLine(line) {
        var FOLD_AT = 20;
        if (line.length <= FOLD_AT) return line;
        var out = line.slice(0, FOLD_AT);
        var rest = line.slice(FOLD_AT);
        while (rest.length) {
            out += "\r\n " + rest.slice(0, FOLD_AT - 1);
            rest = rest.slice(FOLD_AT - 1);
        }
        return out;
    }

    function toICSStampUTC(date) {
        return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    }

    // "YYYY-MM-DD" + "HH:MM" → 로컬(떠 있는) 시각 문자열. 시간대 정보를 넣지 않아
    // 여는 캘린더 앱이 그 컴퓨터의 현재 시간대로 해석한다 (개인용으로는 이 편이 간단하고 안전).
    function toICSLocal(y, m, d, hh, mm) {
        return "" + y + pad(m) + pad(d) + "T" + pad(hh) + pad(mm) + "00";
    }

    // 계획 하나를 .ics로 만든다. plan = { date, time(선택), title, content }
    function buildICS(plan) {
        var uid = "skala-" + (plan.id || Date.now()) + "@skala-front.local";
        var stamp = toICSStampUTC(new Date());
        var dateParts = plan.date.split("-").map(Number);
        var y = dateParts[0], m = dateParts[1], d = dateParts[2];

        var lines = [
            "BEGIN:VCALENDAR", "VERSION:2.0",
            "PRODID:-//SKALA-FRONT//Holiday Plan//KO", "CALSCALE:GREGORIAN",
            "BEGIN:VEVENT", "UID:" + uid, "DTSTAMP:" + stamp
        ];

        if (plan.time) {
            var timeParts = plan.time.split(":").map(Number);
            var start = toICSLocal(y, m, d, timeParts[0], timeParts[1]);
            var end = new Date(y, m - 1, d, timeParts[0], timeParts[1]);
            end.setHours(end.getHours() + 1); // 기본 1시간짜리 일정
            var endStr = toICSLocal(end.getFullYear(), end.getMonth() + 1, end.getDate(), end.getHours(), end.getMinutes());
            lines.push("DTSTART:" + start, "DTEND:" + endStr);
        } else {
            var compact = "" + y + pad(m) + pad(d);
            var next = new Date(y, m - 1, d + 1);
            var compactEnd = "" + next.getFullYear() + pad(next.getMonth() + 1) + pad(next.getDate());
            lines.push("DTSTART;VALUE=DATE:" + compact, "DTEND;VALUE=DATE:" + compactEnd);
        }

        lines.push(foldLine("SUMMARY:" + icsEscape(plan.title)));
        lines.push(foldLine("DESCRIPTION:" + icsEscape(plan.content)));

        // 시간을 정한 계획만 알림을 붙인다 (하루 종일 일정은 특정 "시각"이 없어 알림도 없다)
        if (plan.time) {
            lines.push(
                "BEGIN:VALARM", "ACTION:DISPLAY",
                foldLine("DESCRIPTION:" + icsEscape(plan.title)),
                "TRIGGER:-PT0M", "END:VALARM"
            );
        }

        lines.push("END:VEVENT", "END:VCALENDAR");
        return lines.join("\r\n") + "\r\n";
    }

    // 평일 08:50 입실 / 17:50 퇴실 체크를 매주 반복되는 .ics 하나로 만든다
    function nextWeekday(from) {
        var d = new Date(from);
        while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
        return d;
    }

    function buildFixedICS() {
        var base = nextWeekday(new Date());
        var y = base.getFullYear(), m = base.getMonth() + 1, d = base.getDate();
        var stamp = toICSStampUTC(new Date());

        function vevent(id, hh, mm, title, desc) {
            var start = toICSLocal(y, m, d, hh, mm);
            var end = new Date(y, m - 1, d, hh, mm);
            end.setMinutes(end.getMinutes() + 10);
            var endStr = toICSLocal(end.getFullYear(), end.getMonth() + 1, end.getDate(), end.getHours(), end.getMinutes());
            return [
                "BEGIN:VEVENT",
                "UID:skala-" + id + "@skala-front.local",
                "DTSTAMP:" + stamp,
                "DTSTART:" + start,
                "DTEND:" + endStr,
                "RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR",
                foldLine("SUMMARY:" + icsEscape(title)),
                foldLine("DESCRIPTION:" + icsEscape(desc)),
                "BEGIN:VALARM", "ACTION:DISPLAY", foldLine("DESCRIPTION:" + icsEscape(title)),
                "TRIGGER:-PT0M", "END:VALARM",
                "END:VEVENT"
            ].join("\r\n");
        }

        var lines = [
            "BEGIN:VCALENDAR", "VERSION:2.0",
            "PRODID:-//SKALA-FRONT//Daily Check//KO", "CALSCALE:GREGORIAN",
            vevent("checkin", 8, 50, "🔔 입실 체크", "9시 수업 10분 전입니다. 입실을 확인해 주세요."),
            vevent("checkout", 17, 50, "🔔 퇴실 체크", "18시 종료 10분 전입니다. 퇴실을 확인해 주세요."),
            "END:VCALENDAR"
        ];
        return lines.join("\r\n") + "\r\n";
    }

    function downloadText(text, filename) {
        var blob = new Blob([text], { type: "text/calendar;charset=utf-8" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
    }

    function downloadICS(plan) {
        var safeName = (plan.title || "일정").replace(/[\\/:*?"<>|]/g, "");
        downloadText(buildICS(plan), safeName + ".ics");
    }

    function downloadFixedICS() {
        downloadText(buildFixedICS(), "입실퇴실체크.ics");
    }

    /* ── 공개 API ───────────────────────────── */

    var api = {
        FIXED_ALARMS: FIXED_ALARMS,
        hasNotificationSupport: hasNotificationSupport,
        permission: permission,
        requestPermission: requestPermission,
        fire: fire,
        checkNow: checkNow,
        buildICS: buildICS,
        downloadICS: downloadICS,
        buildFixedICS: buildFixedICS,
        downloadFixedICS: downloadFixedICS,
        // 테스트/디버깅용
        _firedToday: firedToday,
        _markFired: markFired,
        _clearFired: function (tag) { localStorage.removeItem("skala:alarm:" + tag); }
    };

    window.Alarms = api;
})();
