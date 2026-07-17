/*
 * snake.js — 스네이크 게임 로직 (그리드 상태 계산 + 순위표 저장만 담당)
 *
 * 캔버스에 그리는 것, 키보드 입력을 받는 것, 타이머를 돌리는 것은 index.html이 한다.
 * 이 모듈은 "한 칸 전진하면 상태가 어떻게 바뀌는가"만 계산해서 돌려준다.
 */
var SnakeGame = (function () {
    var COLS = 18;
    var ROWS = 18;

    var snake, dir, nextDir, food, score, alive;

    function randomFood() {
        var cell;
        do {
            cell = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
        } while (snake.some(function (s) { return s.x === cell.x && s.y === cell.y; }));
        return cell;
    }

    // 새 게임 시작: 뱀을 가운데에 3칸으로 두고 오른쪽을 보게 한다
    function start() {
        var midY = Math.floor(ROWS / 2);
        snake = [{ x: 9, y: midY }, { x: 8, y: midY }, { x: 7, y: midY }];
        dir = { x: 1, y: 0 };
        nextDir = { x: 1, y: 0 };
        score = 0;
        alive = true;
        food = randomFood();
        return state();
    }

    // 방향키 입력. 진행 중인 방향의 정반대(제자리에서 180도 꺾기)는 무시해서
    // 몸통에 바로 부딪혀 죽는 걸 막는다.
    function setDirection(dx, dy) {
        if (dx === -dir.x && dy === -dir.y) return;
        nextDir = { x: dx, y: dy };
    }

    // 한 칸 전진시킨다. 벽/몸통에 부딪히면 alive를 false로 바꾸고 멈춘다.
    function tick() {
        if (!alive) return state();

        dir = nextDir;
        var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

        var hitWall = head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS;
        var hitSelf = snake.some(function (s) { return s.x === head.x && s.y === head.y; });

        if (hitWall || hitSelf) {
            alive = false;
            return state();
        }

        snake.unshift(head);

        var ate = head.x === food.x && head.y === food.y;
        if (ate) {
            score += 10;
            food = randomFood();
        } else {
            snake.pop();
        }

        return state();
    }

    function state() {
        return {
            snake: snake.slice(),
            food: food,
            score: score,
            alive: alive,
            cols: COLS,
            rows: ROWS
        };
    }

    /* ── 3위(금은동)까지 남는 순위표. 다른 개인 기록(휴일 계획, 메모 등)과 똑같이
     * 로그인한 회원별로 따로 저장한다 (userId가 없으면 아무 것도 남기지 않는다). */
    var SCORES_KEY_PREFIX = "skala:snakeScores:";
    var MAX_SCORES = 3;

    function scoresKey(userId) {
        return SCORES_KEY_PREFIX + userId;
    }

    function getScores(userId) {
        if (!userId) return [];
        try {
            var raw = localStorage.getItem(scoresKey(userId));
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    // 점수를 이 회원의 순위표에 넣어본다. 3등 안에 들면 저장하고 몇 등인지 돌려주고,
    // 못 들면 순위표는 그대로 두고 rank를 null로 돌려준다.
    function recordScore(userId, value) {
        if (!userId) return { scores: [], rank: null };

        var scores = getScores(userId);
        var entry = { score: value, at: new Date().toISOString() };
        scores.push(entry);
        scores.sort(function (a, b) { return b.score - a.score; });
        scores = scores.slice(0, MAX_SCORES);

        var rankIndex = scores.indexOf(entry);
        if (rankIndex === -1) return { scores: scores, rank: null };

        try { localStorage.setItem(scoresKey(userId), JSON.stringify(scores)); } catch (e) { /* 무시 */ }
        return { scores: scores, rank: rankIndex + 1 };
    }

    return {
        start: start,
        setDirection: setDirection,
        tick: tick,
        state: state,
        getScores: getScores,
        recordScore: recordScore
    };
})();
