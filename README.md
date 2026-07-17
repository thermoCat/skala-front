# SKALA-FRONT

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=fff)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=fff)
![JavaScript](https://img.shields.io/badge/Vanilla%20JS-F7DF1E?logo=javascript&logoColor=000)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000?logo=vercel&logoColor=fff)
![No Backend](https://img.shields.io/badge/Backend-없음(localStorage)-555)

SKALA Frontend 과정에서 나온 HTML·CSS·JS 과제들을 낱개 파일로 흩어두지 않고,
로그인 한 번으로 전부 이어지는 **개인 포털 하나**로 묶었다. 서버 없이 정적 파일과
브라우저 저장소만으로 회원가입·개인화·데이터 저장을 전부 처리한다.

**🔗 배포 주소: [skala-front-jet.vercel.app](https://skala-front-jet.vercel.app/)**
— 메인 Hub는 로그인 전엔 흐리게 가려져 있으니, 먼저 회원가입부터 해보시길.

<br/>

## 목차

- [빠르게 훑어보기](#빠르게-훑어보기)
- [페이지 & 기능](#페이지--기능)
- [스펙에는 없지만 얹은 것들](#스펙에는-없지만-얹은-것들)
- [만든 방식](#만든-방식)
- [알아두면 좋은 점](#알아두면-좋은-점)

<br/>

## 빠르게 훑어보기

로컬에서 열 때는 `http://`로 서빙만 되면 된다. 실시간 날씨 기능이 ES 모듈
(`import`/`export`)을 쓰는데, `file://`로 더블클릭해서 열면 브라우저가 CORS
정책으로 모듈 로드를 막아버리기 때문 — VS Code **Live Server 확장**이 이미
있다면 그걸로 열면 그만이고(가장 간단), 따로 없다면 아래처럼 파이썬 내장
서버로도 충분하다.

```bash
python -m http.server 8420
# → http://localhost:8420/html/index.html
```

배포는 Vercel. 실제 페이지가 전부 `html/` 아래에 있어서, 루트(`/`)와 `/이름.html`
요청을 그 안의 파일로 이어주는 `vercel.json` rewrite 두 줄이 전부다.

```json
{ "rewrites": [
  { "source": "/", "destination": "/html/index.html" },
  { "source": "/:page.html", "destination": "/html/:page.html" }
] }
```

<br/>

## 페이지 & 기능

프레임워크도 라이브러리도 없이, 열 개 남짓한 HTML 파일과 그 아래에 딸린 CSS·JS로
구성했다. 페이지별로 흩어보기보다 **한 표**로 모으는 게 빠르니 이렇게 정리한다.

| 페이지 | 이걸 보여주려고 만듦 | 눈에 띄는 구현 |
|---|---|---|
| `index.html` | 로그인한 회원의 개인 포털 허브 | `<nav>`/`<main>`/`<aside>` 3단, 비로그인 시 전체 블러, 오늘의 일정 자동 합산 |
| `signUp.html` → `signUpResult.html` | 회원가입 → 가입 완료 | 아이디·비밀번호 실시간 형식 검사, 중복 확인, 비밀번호 SHA-256 해시 |
| `logIn.html` | 로그인 | 세션은 `localStorage`, 잘못 입력 시 인라인 에러 |
| `myProfile.html` | 자기소개 | `<ul>`(좋아하는 것)·`<ol>`(할 일)·`<dl>`(단어) 조합, 로그인 후 직접 수정 |
| `myClass.html` | 주간 강의 시간표 | `<table>` + `rowspan`/`colspan` 셀 병합 (점심시간 5칸 병합) |
| `myCurriculum.html` | 반별 교육과정 | 가입 때 고른 반에 따라 주차·과목·담당 교수가 달라짐 |
| `myHoliday.html` | 휴일 계획 캘린더 | 날짜 클릭해 계획 등록, 시각 지정 시 알림 + `.ics` 내보내기 |
| `myTrip.html` | 여행 앨범 | 사진·영상·음악 중 고른 것만 앨범 하나로 업로드, 사진은 자동 축소 압축 |
| `myMemo.html` | 개인 메모장 | 회원별 저장, 제목/내용 인라인 수정 |
| `index.html` 안 미니앱 | Up-Down 숫자 맞히기 · 성적 계산기 · 내 가방 · 스네이크 게임 | 전부 `<dialog>` 모달로 진행, 스네이크는 `<canvas>` + 회원별 TOP 3 |

<br/>

## 스펙에는 없지만 얹은 것들

과제가 요구한 최소 범위를 넘어서, 스스로 필요하다고 판단해 추가한 부분들.

- **비밀번호는 평문으로 안 둔다** — Web Crypto의 `crypto.subtle.digest`로 SHA-256 해시만
  `localStorage`에 남기고, 회원가입 화면에서도 아이디·비밀번호를 입력하는 즉시 정규식으로
  형식을 검사해 초록/빨강으로 알려준다.
- **스네이크 게임** — 방향키로 조작하는 `<canvas>` 게임. 시작 전 3·2·1 카운트다운, 죽으면
  캔버스 위에 바로 "다시 하기"가 겹쳐 뜨고, 순위표는 회원별로 금·은·동 3위까지만 남는다.
- **실시간 날씨** — 도시를 고르면(`<select>` `change`) Open-Meteo API를 `fetch`+`async/await`로
  호출한다. 데이터 처리(`weatherAPI.js`)와 화면 그리기(`realtimeInfo.js`)를 ES 모듈로 분리했다.
- **폰트를 직접 서빙** — 픽셀 폰트(Galmuri14)를 외부 CDN에 계속 걸어뒀더니 새로고침마다
  살짝 늦게 뒤바뀌어 보이는 게 거슬려서, 실제 쓰는 굵기 하나만 프로젝트에 내려받아
  `@font-face`로 직접 서빙하도록 바꿨다.
- **Dark Reader 같은 확장 프로그램 방지** — 이미 다크 테마 전용으로 만든 사이트인데,
  다크모드 확장이 그라디언트 텍스트를 뭉개버리는 걸 발견해서 `<meta name="darkreader-lock">`로
  막았다.
- **알림 + 캘린더 내보내기** — 입실·퇴실 브라우저 알림과 `.ics` 파일(맥 캘린더/아웃룩/구글
  캘린더용) 내보내기를 같이 넣어서, 탭을 닫아둬도 일정 알림은 받을 수 있게 했다.

<br/>

## 만든 방식

<details>
<summary><b>스타일링</b> — <code>css/global.css</code> + 페이지별 CSS</summary>
<br/>

색상·간격 같은 디자인 토큰은 `:root` 커스텀 프로퍼티로 `global.css`에 몰아넣고 모든
페이지가 공통으로 링크한다. 페이지 고유 스타일(카드 폭, 배지 크기 등)은 그 페이지의
CSS 파일에만 남겨 공통 파일이 비대해지지 않게 했다. 애니메이션은 `@keyframes`/`transition`,
그라디언트 텍스트는 `background-clip: text`, 카드 유리 효과는 `backdrop-filter`.
786px 이하에서는 3단 레이아웃이 세로 1열로 접힌다. 다크 전용 테마라 라이트 모드
토글은 없다.

</details>

<details>
<summary><b>스크립트</b> — 회원별 저장은 전부 <code>js/core/auth.js</code>를 거친다</summary>
<br/>

로그인/회원가입/개인화 로직을 `js/core/auth.js` 하나에 모으고, 나머지 기능(알림,
정적 데이터, 날씨)은 성격에 따라 `js/features/`, `js/data/`로 나눴다. 미니앱 4종
(`upDown.js`, `grade.js`, `bag.js`, `snake.js`)은 `script/`에 따로 둬서 "게임/도구"
성격의 코드와 "사이트 기반" 코드를 구분했다. 소개·여행 앨범·휴일 계획·메모·가방·
스네이크 순위표까지, 회원별 데이터는 전부 `localStorage`에 아이디를 키로 따로
저장한다.

</details>

<details>
<summary><b>기술 스택 요약</b></summary>
<br/>

| 구분 | 사용한 것 |
|---|---|
| HTML | 시맨틱 태그, `<form method="get">`, `<table>` 셀 병합, `<dialog>`, `<canvas>`, `<ul>`/`<ol>`/`<dl>` |
| CSS | 커스텀 프로퍼티, Flexbox/Grid, `@keyframes`, `backdrop-filter`, `@font-face` 자체 호스팅 |
| JS | ES Module, `fetch`+`async/await`, Web Crypto(SHA-256), Canvas 루프, `localStorage`, Notification API |
| 외부 연동 | [Open-Meteo](https://open-meteo.com)(날씨, 키 불필요) |
| 배포 | Vercel + `vercel.json` rewrite |

</details>

<br/>

## 알아두면 좋은 점

- 비밀번호는 SHA-256 해시로만 저장하지만, 서버 없이 브라우저에만 있는 구조라는 한계는
  여전하다. 실제 서비스라면 서버에서 salt를 더해 검증해야 한다.
- 브라우저 알림은 이 탭이 열려 있을 때만 울린다. 컴퓨터를 꺼둬도 알림을 받으려면
  `.ics` 캘린더 등록 쪽을 쓰면 된다.
- 모든 데이터가 `localStorage` 기준이라 브라우저·시크릿 모드·다른 기기에서는 가입
  정보와 게시물이 보이지 않는다 — 버그가 아니라 원래 그렇다.
