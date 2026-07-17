/*
 * upDown.js — Up-Down 숫자 맞추기 게임 로직
 *
 * 컴퓨터가 1~50 사이의 숫자를 하나 정해두고, 사용자가 추측한 값과 비교해서
 * "up"(정답보다 작음) / "down"(정답보다 큼) / "win"(정답) / "invalid"(숫자가 아님)
 * 중 하나를 돌려준다. 화면에 보여주는 것(모달 열고 닫기, 문구 갱신)은 index.html이 한다.
 */
var UpDownGame = (function () {
    var answer = null;
    var tries = 0;

    // 새 게임 시작: 1~50 사이 숫자를 새로 뽑고 시도 횟수를 0으로 되돌린다
    function start() {
        answer = Math.floor(Math.random() * 50) + 1;
        tries = 0;
    }

    // 사용자가 입력한 값을 정답과 비교한다
    function guess(value) {
        var num = Number(value);
        if (value === "" || isNaN(num)) {
            return { result: "invalid" };
        }

        tries++;
        if (num > answer) return { result: "down", tries: tries };
        if (num < answer) return { result: "up", tries: tries };
        return { result: "win", tries: tries };
    }

    return { start: start, guess: guess };
})();
