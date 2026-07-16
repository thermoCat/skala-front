# 이어서 작업하기

다른 컴퓨터에서, 또는 새 세션에서 이 프로젝트를 이어갈 때 참고할 문서.

```
git clone https://github.com/thermoCat/skala-front.git
```

## 지금까지 만든 것 (커밋 순서)

1. **`9e3c73a`** — index, myProfile(ul/ol/dl 자기소개), myClass(table 시간표),
   signUp, signUpResult. 과제 스펙에 맞춘 최초 페이지들.
2. **`4a76048`** — 회원가입 버튼을 우측 상단 고정 버튼으로 분리.
3. **`2e8c195`** — myTrip(여행 앨범) 추가, index를 `<nav>`/`<main>`/`<aside>`
   포털형 메인 Hub로 개편.
4. **`6b919fe`** — logIn.html 신설, `js/auth.js` 최초 작성 (localStorage 기반
   로그인/개인화 공통 모듈).
5. **`a54a6d2`** — 소개 목록(좋아하는 것/할 일/단어) 개인화, 바로가기 메뉴 로그인 제한.
6. **`b14146e`** — 메인 Hub에 "오늘의 일정" 추가, 로그인 잠금을 메뉴 숨김에서
   전체 블러 처리로 변경.
7. **`da4581b`** — 여행 사진 브라우저 업로드(자동 압축), 프로필 수정 기능.
8. **`03c8fef`** — 소개 항목을 3칸 고정 입력으로 변경(오류 방지), 로그아웃 시
   메인으로 리다이렉트.
9. **`b289177`** — 신규 계정에 예시 사진이 자기 것처럼 보이던 버그 수정.
10. **`dad62b2`** — myHoliday(휴일 계획 캘린더), `js/alarms.js`(입실·퇴실 알림 +
    `.ics` 캘린더 내보내기), myMemo(개인 메모장) 추가.

## 디자인 컨벤션 — 반드시 맞춰서 작업할 것

모든 페이지가 같은 다크 테마를 쓴다. 새 페이지/컴포넌트를 만들 때 아래를 그대로 재사용한다.

**색상 변수** (모든 `<style>` 최상단에 동일하게 선언):
```css
--bg: #0a0a12;
--surface: rgba(255, 255, 255, 0.05);
--border: rgba(255, 255, 255, 0.1);
--text: #e8e8f0;
--muted: #9a9ab0;
--accent-1: #7c5cff;  /* 보라 */
--accent-2: #00d4ff;  /* 시안 */
--accent-3: #ff5c8a;  /* 핑크 */
```

**공통 구성 요소**
- **배경**: 움직이는 오로라(`.aurora` + 3개 `<span>`, `radial-gradient` + `drift` 애니메이션)
- **카드**: `border-radius: 28px`, `background: var(--surface)`, `backdrop-filter: blur(16px)`,
  `border: 1px solid var(--border)`, 그림자 `box-shadow: 0 24px 80px rgba(0,0,0,.45)`
- **배지**: 알약 모양(`border-radius: 999px`), 초록 점(`.dot`)이 깜빡이는 "SKALA FRONTEND · 페이지명"
- **그라디언트 텍스트**: `linear-gradient(90deg, accent-1, accent-2, accent-3, accent-1)` +
  `background-clip: text` + `shine` 애니메이션으로 흐르는 효과
- **버튼**: primary는 accent-1→accent-2 그라디언트, ghost는 반투명 배경 + 테두리
- **우측 상단**: `<div id="auth-area"></div>` 하나만 넣으면 `auth.js`가 로그인 상태에
  따라 로그인/회원가입 또는 "○○님 · 로그아웃" 버튼을 자동으로 그린다
- **인터랙션**: 메뉴·카드 클릭 시 색종이 폭죽(`fireConfetti`) 후 0.7초 뒤 이동 —
  index.html 하단 스크립트에 구현 있음, 복붙해서 재사용

새 페이지를 만들 때는 기존 페이지(`myMemo.html`이 가장 단순한 예시) 하나를 통째로
복사해서 시작하는 게 제일 빠르고 톤이 어긋나지 않는다.

## 코드 구조 — 반드시 이해하고 이어갈 것

- **`js/auth.js`** — 회원/로그인/개인화 공통 모듈. 페이지에 `<script src="../js/auth.js">`만
  추가하면:
  - `<div id="auth-area"></div>` → 로그인 버튼 자동 렌더링
  - `<span data-personal="name" data-fallback="게스트">` → 로그인 값 또는 기본값 자동 채움
  - `<div data-auth="in" hidden>` / `data-auth="out" hidden` → 로그인 여부로 자동 표시/숨김
  - `Auth.saveUser/getUser/login/logout/currentUser` 및 사진·휴일·메모 저장 함수
    (`get/savePhotos`, `get/saveHolidays`, `get/saveMemos`) — 전부 회원별 키
    (`skala:photos:{userId}` 등)로 분리 저장
  - `Auth.collectSlots/fillSlots`, `collectPairs/fillPairs` — "3칸 고정 입력" 폼을
    읽고 채우는 헬퍼 (좋아하는 것/할 일/단어에 사용 중)
- **`js/alarms.js`** — 브라우저 알림 + `.ics` 캘린더 내보내기. 평일 08:50/17:50
  고정 알림과 휴일 계획 시각 알림을 20초마다 확인. `Alarms.fire`는 내부에서도
  `api.fire`로 참조하므로 테스트 시 몽키패치 가능.
- **`js/timetable.js`** — 강의 시간표 데이터. **`html/myClass.html`의 표와 내용이
  같아야 하므로, 시간표를 바꾸면 두 곳을 함께 고쳐야 한다.**

## 지켜야 할 규칙

- **`html/myClass.html`은 절대 수정하지 않는다** — 시간표 고정 과제라 처음부터
  손대지 않기로 한 파일.
- 커밋은 한국어 컨벤셔널 커밋(`feat:`, `fix:`, `docs:`)으로 작성하고,
  `Co-Authored-By: Claude` 등 AI 관련 표기는 넣지 않는다.
- 회원·사진·계획·메모는 전부 브라우저 `localStorage`에만 저장된다. 컴퓨터를
  옮기면 이전에 만든 테스트 계정과 데이터는 남아있지 않다 (정상 동작이며
  버그가 아니다).

## 미완/확인 필요

- `myTrip.html`은 사용자 요청으로 배경음악(`<audio>`)과 브이로그(`<video>`)를
  제거한 상태다. 원래 과제 스펙은 이 두 요소를 필수로 요구하므로, 제출 전
  다시 넣을지 확인이 필요하다.
- 알림 기능은 실제 기기에서 각 페이지의 "🧪 지금 테스트 알림 보내기" 버튼으로
  직접 켜고 확인해야 한다 (브라우저 알림 권한은 기기·브라우저별로 따로 설정됨).
- README.md의 스크린샷 표는 자리만 있고 이미지가 없다. 캡처해서 채워 넣을 것.
