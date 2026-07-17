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
4. **`6b919fe`** — logIn.html 신설, `js/core/auth.js` 최초 작성 (localStorage 기반
   로그인/개인화 공통 모듈).
5. **`a54a6d2`** — 소개 목록(좋아하는 것/할 일/단어) 개인화, 바로가기 메뉴 로그인 제한.
6. **`b14146e`** — 메인 Hub에 "오늘의 일정" 추가, 로그인 잠금을 메뉴 숨김에서
   전체 블러 처리로 변경.
7. **`da4581b`** — 여행 사진 브라우저 업로드(자동 압축), 프로필 수정 기능.
8. **`03c8fef`** — 소개 항목을 3칸 고정 입력으로 변경(오류 방지), 로그아웃 시
   메인으로 리다이렉트.
9. **`b289177`** — 신규 계정에 예시 사진이 자기 것처럼 보이던 버그 수정.
10. **`dad62b2`** — myHoliday(휴일 계획 캘린더), `js/features/alarms.js`(입실·퇴실 알림 +
    `.ics` 캘린더 내보내기), myMemo(개인 메모장) 추가.
11. 여행 앨범을 사진+영상+음악 묶음으로 개편, 회원가입에 소속 반을 받아 반별
    교육과정 페이지(myCurriculum.html) 추가, `css/base.css` 공통 스타일 분리 및
    `js/` 폴더를 `core/features/data`로 재구성.

## 디자인 컨벤션 — 반드시 맞춰서 작업할 것

모든 페이지가 같은 다크 테마를 쓴다. 새 페이지/컴포넌트를 만들 때 아래를 그대로 재사용한다.

**`css/base.css`를 모든 페이지의 `<title>` 바로 아래에서 링크한다**
(`<link rel="stylesheet" href="../css/base.css">`, `<style>`보다 먼저). 색상 변수,
리셋, 오로라 배경, 배지의 초록 점, 그라디언트 텍스트, 카드 등장 애니메이션,
footer 링크 색상처럼 페이지마다 토씨 하나 다르지 않던 것들이 여기 들어있다.
카드 폭·배지 글자 크기·제목 크기처럼 페이지마다 실제로 다른 값은 각 페이지의
`<style>`에 그대로 남겨뒀다. **`html/myClass.html`은 이 파일을 링크하지 않는다**
(아래 "지켜야 할 규칙" 참고) — 필요한 스타일을 예전처럼 `<style>` 안에 전부 갖고 있다.

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
- **배경**: 움직이는 오로라(`.aurora` + 3개 `<span>`, `radial-gradient` + `drift` 애니메이션) — `css/base.css`
- **카드**: `border-radius: 28px`, `background: var(--surface)`, `backdrop-filter: blur(16px)`,
  `border: 1px solid var(--border)`, 그림자 `box-shadow: 0 24px 80px rgba(0,0,0,.45)` —
  이 틀은 각 페이지 `<style>`에 있고(카드 폭은 페이지마다 다름), 안의 `.badge .dot` 점
  깜빡임과 `h1 .gradient`/`h2 .accent` 그라디언트 텍스트 효과는 `css/base.css`가 담당
- **배지**: 알약 모양(`border-radius: 999px`), 초록 점(`.dot`)이 깜빡이는 "SKALA FRONTEND · 페이지명"
- **그라디언트 텍스트**: `linear-gradient(90deg, accent-1, accent-2, accent-3, accent-1)` +
  `background-clip: text` + `shine` 애니메이션으로 흐르는 효과
- **버튼**: primary는 accent-1→accent-2 그라디언트, ghost는 반투명 배경 + 테두리
- **우측 상단**: `<div id="auth-area"></div>` 하나만 넣으면 `auth.js`가 로그인 상태에
  따라 로그인/회원가입 또는 "○○님 · 로그아웃" 버튼을 자동으로 그린다
- **인터랙션**: 메뉴·카드 클릭 시 색종이 폭죽(`fireConfetti`) 후 0.7초 뒤 이동 —
  index.html 하단 스크립트에 구현 있음, 복붙해서 재사용

새 페이지를 만들 때는 기존 페이지(`myMemo.html`이 가장 단순한 예시) 하나를 통째로
복사해서 시작하는 게 제일 빠르고 톤이 어긋나지 않는다. `css/base.css` 링크와
`<script src="../js/core/auth.js">` 등 스크립트 경로도 함께 따라온다.

## 폴더 구조

```
css/    base.css — 모든 페이지가 공유하는 색상 변수·리셋·오로라·공통 애니메이션
html/   페이지별 HTML
js/
  core/      auth.js — 회원/로그인/개인화 (거의 모든 페이지가 의존)
  features/  alarms.js — 알림·ICS 내보내기 같은 개별 기능
  data/      timetable.js, curriculum.js — 정적 데이터 모음
media/  사진/영상/음악 자산
```

## 코드 구조 — 반드시 이해하고 이어갈 것

- **`js/core/auth.js`** — 회원/로그인/개인화 공통 모듈. 페이지에
  `<script src="../js/core/auth.js">`만 추가하면:
  - `<div id="auth-area"></div>` → 로그인 버튼 자동 렌더링
  - `<span data-personal="name" data-fallback="게스트">` → 로그인 값 또는 기본값 자동 채움
  - `<div data-auth="in" hidden>` / `data-auth="out" hidden` → 로그인 여부로 자동 표시/숨김
  - `Auth.saveUser/getUser/login/logout/currentUser` 및 앨범·휴일·메모 저장 함수
    (`get/saveAlbums`, `get/saveHolidays`, `get/saveMemos`) — 전부 회원별 키
    (`skala:albums:{userId}` 등)로 분리 저장
  - `Auth.collectSlots/fillSlots`, `collectPairs/fillPairs` — "3칸 고정 입력" 폼을
    읽고 채우는 헬퍼 (좋아하는 것/할 일/단어에 사용 중)
- **`js/features/alarms.js`** — 브라우저 알림 + `.ics` 캘린더 내보내기. 평일 08:50/17:50
  고정 알림과 휴일 계획 시각 알림을 20초마다 확인. `Alarms.fire`는 내부에서도
  `api.fire`로 참조하므로 테스트 시 몽키패치 가능.
- **`js/data/timetable.js`** — 강의 시간표 데이터. **`html/myClass.html`의 표와 내용이
  같아야 하므로, 시간표를 바꾸면 두 곳을 함께 고쳐야 한다.**
- **`js/data/curriculum.js`** — 반별(1~4반) 실제 교육과정 캘린더 데이터. `skala_timetable.xlsx`
  원본 스프레드시트를 그대로 옮긴 것이며, `Curriculum.forClass(classNo)`가 그 반의
  시선으로 본 { date, day, week, subject, holiday, professor } 목록을 돌려준다.
  `html/myCurriculum.html`이 이 데이터를 회원의 `user.classNo`로 필터링해서 보여준다.

## 지켜야 할 규칙

- **`html/myClass.html`은 절대 수정하지 않는다** — 시간표 고정 과제라 처음부터
  손대지 않기로 한 파일. `css/base.css` 공통 스타일 분리 작업 때도 이 파일만
  예외로 두고 자체 `<style>`을 그대로 뒀다.
- 커밋은 한국어 컨벤셔널 커밋(`feat:`, `fix:`, `docs:`)으로 작성하고,
  `Co-Authored-By: Claude` 등 AI 관련 표기는 넣지 않는다.
- 회원·사진·계획·메모는 전부 브라우저 `localStorage`에만 저장된다. 컴퓨터를
  옮기면 이전에 만든 테스트 계정과 데이터는 남아있지 않다 (정상 동작이며
  버그가 아니다).

## 미완/확인 필요

- `myTrip.html`은 "사진첩" 형태로 개편했다. 한 번 업로드하면 사진(여러 장)+영상+음악이
  앨범 하나로 묶이고, 메인 화면에는 대표 사진(썸네일) 카드만 늘어서며 눌러야 앨범
  전체(사진 그리드 + `<audio><source>` + `<video><source>`)를 볼 수 있다. 저장 구조도
  `Auth.getPhotos/savePhotos`(사진 1장=1건)에서 `Auth.getAlbums/saveAlbums`(앨범
  1건=사진+영상+음악 묶음, `skala:albums:{userId}`)로 바뀌었다.
- 비로그인 방문자는 앨범을 볼 수 없고 로그인 안내만 보인다. 대신 모든 회원은
  `js/core/auth.js`의 `Auth.getAlbums`가 앨범을 처음 조회하는 시점에 "SKALA 캠퍼스 여행"
  기본 앨범(사진 2장+노래+영상)을 자동으로 심어준다 — 새 가입자뿐 아니라 이 기능이
  생기기 전부터 있던 회원도 마찬가지다. 회원이 이 앨범을 지우면 다시 채워 넣지 않는다.
  media 파일(`skala-banner.jpg`, `sk-logo.png`, `skala-song.mp3`, `skala-vlog.mp4`)은
  전부 넣어뒀다 (`media/README.md` 참고).
- 영상 4MB / 음악 3MB 크기 제한을 코드에 넣어뒀다(localStorage 용량 제약). 필요하면
  `html/myTrip.html`의 `MAX_VIDEO_BYTES`/`MAX_AUDIO_BYTES`를 조정한다.
- 알림 기능은 실제 기기에서 각 페이지의 "🧪 지금 테스트 알림 보내기" 버튼으로
  직접 켜고 확인해야 한다 (브라우저 알림 권한은 기기·브라우저별로 따로 설정됨).
- `signUp.html`에 "소속 반"(1~4반) 필수 선택 필드를 추가했고, `myProfile.html`에서도
  보고 고칠 수 있다. `js/data/curriculum.js`는 `skala_timetable.xlsx`(2026-07-10 기준)
  원본을 그대로 옮겼지만, 원본 데이터 자체에 빈 칸이 있어 다음 규칙으로 보정했다 —
  자세한 건 `js/data/curriculum.js` 파일 맨 위 주석 참고:
  - "주차" 칸이 비어 있으면 휴일/휴강으로 본다.
  - 네 반 중 담당 교수가 정확히 한 칸에만 적혀 있으면 전체 반 공통 특강으로 보고
    4개 반 모두에 그 교수를 채웠다.
  - 그 외 특정 반만 비어 있는 경우는 원본에 그 반 교수가 기록되지 않았던 것이라
    값을 지어내지 않고 "미정"으로 남겼다 (예: 2026-09-21 2반).
  - 새 스프레드시트를 받으면 `js/data/curriculum.js` 생성에 쓴 추출 로직을 다시 돌려야
    한다 (스크립트 자체는 저장해두지 않았으니, 같은 시트 구조라면 openpyxl로
    새로 뽑으면 된다).
- CSS/JS 정리 작업으로 모든 페이지가 `css/base.css`를 링크하고, `js/`가
  `core/features/data`로 나뉘었다 (`html/myClass.html`만 예외 — 위 "지켜야 할 규칙"
  참고). 페이지마다 다르던 부분(카드 폭, 배지·제목 글자 크기 등)은 그대로 각 페이지
  `<style>`에 남아 있고, 완전히 똑같던 부분만 `css/base.css`로 옮겼다. 유일한 예외는
  `myProfile.html`의 오로라 투명도(0.32/0.18, 다른 페이지는 0.3/0.16)인데, 원래도
  이 페이지만 살짝 진하게 되어 있어서 `css/base.css` 링크 뒤에 그 두 줄만 오버라이드로
  남겨뒀다.
- README.md의 스크린샷 표는 자리만 있고 이미지가 없다. 캡처해서 채워 넣을 것.
