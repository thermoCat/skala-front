/*
 * grade.js — 성적 계산기 로직
 *
 * 3과목(HTML, CSS, JavaScript) 점수를 한 과목씩 받아 총점에 더하고, 마지막 과목까지
 * 받으면 평균을 구해 합격(60점 이상) 여부를 판정한다. 화면에 보여주는 것(모달 열고
 * 닫기, 문구 갱신)은 index.html이 한다.
 */
var GradeCalculator = (function () {
    var subjects = ["HTML", "CSS", "JavaScript"];
    var passScore = 60;
    var index = 0;
    var total = 0;

    // 새로 시작: 과목 순서와 총점을 처음으로 되돌린다
    function start() {
        index = 0;
        total = 0;
    }

    // 지금 입력받아야 할 과목 이름
    function currentSubject() {
        return subjects[index];
    }

    // 점수를 총점에 더하고 다음 과목으로 넘어간다
    function submit(value) {
        var num = Number(value);
        if (value === "" || isNaN(num)) {
            return { result: "invalid" };
        }

        total += num;
        index++;

        if (index < subjects.length) {
            return { result: "next", subject: subjects[index] };
        }

        var average = total / subjects.length;
        var pass = average >= passScore;
        return { result: "done", total: total, average: average, pass: pass, passScore: passScore };
    }

    return { start: start, currentSubject: currentSubject, submit: submit };
})();
