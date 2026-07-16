# media

`myTrip.html`과 `index.html`이 참조하는 미디어 파일을 이 폴더에 넣습니다.
아래 이름 그대로 저장하면 HTML 수정 없이 바로 재생·표시됩니다.

## 오디오 — 여행 앨범 배경 음악

| 파일명 | 형식 | 비고 |
| --- | --- | --- |
| `travel-theme.mp3` | audio/mpeg | 필수 |
| `travel-theme.ogg` | audio/ogg | 선택 (mp3 미지원 브라우저 대비) |

## 이미지 — 여행 사진

| 파일명 | 쓰이는 곳 | 설명 |
| --- | --- | --- |
| `lijiang-gorge.jpg` | myTrip, index(베스트 컷) | 리장 호도협 |
| `cebu-night.jpg` | myTrip | 세부 밤 스카이라인 |
| `hokkaido.jpg` | myTrip | 홋카이도 대설산 |
| `vlog-poster.jpg` | myTrip | 영상 재생 전 표지 이미지 |

가로:세로 16:10 비율을 권장합니다. 다른 비율이어도 잘리지 않고 맞춰집니다.

## 비디오 — 여행 브이로그

| 파일명 | 형식 | 비고 |
| --- | --- | --- |
| `travel-vlog.mp4` | video/mp4 | 필수 |
| `travel-vlog.webm` | video/webm | 선택 |

## 파일을 바꾸고 싶다면

이름을 바꾸려면 `html/myTrip.html`의 `<source src="...">`, `<img src="...">`와
`html/index.html`의 베스트 컷 `<img src="...">` 경로를 함께 고치면 됩니다.
