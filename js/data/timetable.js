/*
 * timetable.js — 주간 강의 시간표 데이터
 *
 * 시간표는 모든 회원에게 동일하다. index.html의 "오늘의 일정"이 이 데이터를 읽어
 * 현재 시각에 맞는 수업을 골라 보여준다.
 *
 * ※ 화면에 보이는 표는 myClass.html에 <table>로 직접 작성되어 있다.
 *   과제에서 table/thead/tbody/rowspan을 HTML로 요구하므로 그쪽은 정적으로 두었고,
 *   여기 데이터와 내용이 같아야 한다. 시간표를 바꿀 때는 두 곳을 함께 고칠 것.
 */
(function () {
    "use strict";

    var LUNCH = { start: "12:00", end: "13:00", title: "점심 시간", icon: "🍔", lunch: true };

    // 0=일요일 … 6=토요일
    var WEEK = {
        1: [
            { start: "09:00", end: "12:00", title: "Vue.js 웹 프레임워크", icon: "💻" },
            LUNCH,
            { start: "13:00", end: "17:00", title: "UI/UX 디자인 표준", icon: "🎨" },
            { start: "17:00", end: "18:00", title: "취업 창업 특강", icon: "💼" }
        ],
        2: [
            { start: "09:00", end: "11:00", title: "네트워크 보안 기초", icon: "🔒" },
            { start: "11:00", end: "12:00", title: "알고리즘 문제풀이", icon: "🧠" },
            LUNCH,
            { start: "13:00", end: "15:00", title: "리눅스 시스템 관리", icon: "🐧" },
            { start: "15:00", end: "17:00", title: "Git & GitHub 버전 관리", icon: "🐙" }
        ],
        3: [
            { start: "09:00", end: "12:00", title: "웹 시스템 설계 및 분석", icon: "🔧" },
            LUNCH,
            { start: "13:00", end: "15:00", title: "클라우드 AWS 기초", icon: "☁️" },
            { start: "15:00", end: "17:00", title: "인공지능 머신러닝 기초", icon: "🤖" }
        ],
        4: [
            { start: "09:00", end: "10:00", title: "IT 트렌드 특강", icon: "💡" },
            { start: "10:00", end: "12:00", title: "데이터베이스 SQL 실습", icon: "📱" },
            LUNCH,
            { start: "13:00", end: "15:00", title: "자료구조", icon: "📊" },
            { start: "15:00", end: "17:00", title: "빅데이터 분석 실무", icon: "📈" }
        ],
        5: [
            { start: "09:00", end: "12:00", title: "자바스크립트 심화 실습", icon: "🚀" },
            LUNCH,
            { start: "13:00", end: "14:00", title: "개인 프로젝트", icon: "🚀" },
            { start: "14:00", end: "17:00", title: "오픈소스 소프트웨어", icon: "🔓" },
            { start: "17:00", end: "18:00", title: "주간 회고", icon: "📝" }
        ]
    };

    var DAY_NAME = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

    // "09:30" → 570 (자정부터 지난 분)
    function toMinutes(hhmm) {
        var p = hhmm.split(":");
        return Number(p[0]) * 60 + Number(p[1]);
    }

    function minutesOf(date) {
        return date.getHours() * 60 + date.getMinutes();
    }

    // 해당 요일의 수업 목록 (수업 없는 날은 빈 배열)
    function forDay(day) {
        return WEEK[day] || [];
    }

    // 기준 시각에서 본 수업 상태: "past" | "now" | "next"
    function stateOf(item, nowMinutes) {
        if (nowMinutes >= toMinutes(item.end)) return "past";
        if (nowMinutes >= toMinutes(item.start)) return "now";
        return "next";
    }

    // 오늘 일정을 상태와 함께 돌려준다
    function today(now) {
        now = now || new Date();
        var list = forDay(now.getDay());
        var mins = minutesOf(now);
        return {
            date: now,
            dayName: DAY_NAME[now.getDay()],
            hasClass: list.length > 0,
            items: list.map(function (item) {
                return Object.assign({}, item, { state: stateOf(item, mins) });
            })
        };
    }

    window.Timetable = {
        forDay: forDay,
        today: today,
        stateOf: stateOf,
        toMinutes: toMinutes,
        dayName: function (day) { return DAY_NAME[day]; }
    };
})();
