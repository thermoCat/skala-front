/*
 * curriculum.js — 반별(1~4반) 실제 교육과정 캘린더 데이터
 *
 * SKALA 4개반 시간표 원본 스프레드시트(skala_timetable.xlsx, 2026-07-10 기준)를
 * 그대로 옮겨 만들었다. classes 배열은 [1반, 2반, 3반, 4반] 순서의 담당 교수명이다.
 *
 * ※ 원본 그대로 옮기지 못해 다음 규칙으로 보정한 부분이 있다.
 *   - "주차" 칸이 비어 있으면 휴일/휴강으로 본다 (holiday: true, 담당 교수 없음).
 *   - 네 반 중 담당 교수가 정확히 한 칸에만 적혀 있고 나머지 세 칸이 비어 있으면
 *     전체 반 공통 특강(취업특강 등)으로 보고 그 교수를 4개 반 모두에 채웠다.
 *   - 그 외에 특정 반만 비어 있는 경우는 원본 스프레드시트에 그 반의 교수가
 *     기록되어 있지 않았던 것이다. 값을 지어내지 않고 담당 교수 없음(null)으로 남겼다.
 *   - 마지막 주(2026-12-14~18, 23주차)는 원본에 과목이 채워지지 않아 제외했다.
 */
(function () {
    "use strict";

    var ENTRIES =
    [
        {
            "date": "2026-07-14",
            "day": "화",
            "week": 1,
            "subject": "팀빌딩(심요한), Git 이해/활용 (5h)",
            "holiday": false,
            "classes": [
                "강병호",
                "류홍걸",
                "김성영",
                "엄진영"
            ]
        },
        {
            "date": "2026-07-15",
            "day": "수",
            "week": 1,
            "subject": "HTML, CSS, JavaScript",
            "holiday": false,
            "classes": [
                "강병호",
                "류홍걸",
                "김성영",
                "엄진영"
            ]
        },
        {
            "date": "2026-07-16",
            "day": "목",
            "week": 1,
            "subject": "HTML, CSS, JavaScript",
            "holiday": false,
            "classes": [
                "강병호",
                "류홍걸",
                "김성영",
                "엄진영"
            ]
        },
        {
            "date": "2026-07-17",
            "day": "금",
            "week": null,
            "subject": "대체휴일(개천절)",
            "holiday": true,
            "classes": [
                null,
                null,
                null,
                null
            ]
        },
        {
            "date": "2026-07-20",
            "day": "월",
            "week": 2,
            "subject": "데이터 분석을 위한 Python 이해",
            "holiday": false,
            "classes": [
                "이상희",
                "백정열",
                "김성영",
                "류홍걸"
            ]
        },
        {
            "date": "2026-07-21",
            "day": "화",
            "week": 2,
            "subject": "데이터 분석을 위한 Python 이해",
            "holiday": false,
            "classes": [
                "이상희",
                "백정열",
                "김성영",
                "류홍걸"
            ]
        },
        {
            "date": "2026-07-22",
            "day": "수",
            "week": 2,
            "subject": "스마트 데이터 이해 및 활용",
            "holiday": false,
            "classes": [
                "이상희",
                "김덕우",
                "백정열",
                "류홍걸"
            ]
        },
        {
            "date": "2026-07-23",
            "day": "목",
            "week": 2,
            "subject": "스마트 데이터 이해 및 활용",
            "holiday": false,
            "classes": [
                "이상희",
                "김덕우",
                "백정열",
                "류홍걸"
            ]
        },
        {
            "date": "2026-07-24",
            "day": "금",
            "week": 2,
            "subject": "스마트 데이터 이해 및 활용",
            "holiday": false,
            "classes": [
                "이상희",
                "김덕우",
                "백정열",
                "류홍걸"
            ]
        },
        {
            "date": "2026-07-27",
            "day": "월",
            "week": 3,
            "subject": "데이터 분석 개요 및 기초통계",
            "holiday": false,
            "classes": [
                "한성훈",
                "류홍걸",
                "조홍근",
                "박병선"
            ]
        },
        {
            "date": "2026-07-28",
            "day": "화",
            "week": 3,
            "subject": "데이터 분석 개요 및 기초통계",
            "holiday": false,
            "classes": [
                "한성훈",
                "류홍걸",
                "조홍근",
                "박병선"
            ]
        },
        {
            "date": "2026-07-29",
            "day": "수",
            "week": 3,
            "subject": "Prompt 설계와 Context",
            "holiday": false,
            "classes": [
                "박병선",
                "류홍걸",
                "조홍근",
                "한성훈"
            ]
        },
        {
            "date": "2026-07-30",
            "day": "목",
            "week": 3,
            "subject": "LLM과 Transformer 아키텍처",
            "holiday": false,
            "classes": [
                "박병선",
                "류홍걸",
                "이해경",
                "한성훈"
            ]
        },
        {
            "date": "2026-07-31",
            "day": "금",
            "week": 3,
            "subject": "LLM과 Transformer 아키텍처",
            "holiday": false,
            "classes": [
                "박병선",
                "류홍걸",
                "이해경",
                "한성훈"
            ]
        },
        {
            "date": "2026-08-03",
            "day": "월",
            "week": 4,
            "subject": "Java, SpringBoot, Rest API 구현",
            "holiday": false,
            "classes": [
                "조재형",
                "정윤석",
                "최주호",
                "류홍걸"
            ]
        },
        {
            "date": "2026-08-04",
            "day": "화",
            "week": 4,
            "subject": "Java, SpringBoot, Rest API 구현",
            "holiday": false,
            "classes": [
                "조재형",
                "정윤석",
                "최주호",
                "류홍걸"
            ]
        },
        {
            "date": "2026-08-05",
            "day": "수",
            "week": 4,
            "subject": "Java, SpringBoot, Rest API 구현",
            "holiday": false,
            "classes": [
                "조재형",
                "정윤석",
                "최주호",
                "류홍걸"
            ]
        },
        {
            "date": "2026-08-06",
            "day": "목",
            "week": 4,
            "subject": "Java, SpringBoot, Rest API 구현",
            "holiday": false,
            "classes": [
                "조재형",
                "정윤석",
                "최주호",
                "류홍걸"
            ]
        },
        {
            "date": "2026-08-07",
            "day": "금",
            "week": 4,
            "subject": "Java, SpringBoot, Rest API 구현",
            "holiday": false,
            "classes": [
                "조재형",
                "정윤석",
                "최주호",
                "류홍걸"
            ]
        },
        {
            "date": "2026-08-10",
            "day": "월",
            "week": 5,
            "subject": "Agile 방법론 및 MSA 개발",
            "holiday": false,
            "classes": [
                "조재형",
                "조홍근",
                "임성열",
                "류홍걸"
            ]
        },
        {
            "date": "2026-08-11",
            "day": "화",
            "week": 5,
            "subject": "Agile 방법론 및 MSA 개발",
            "holiday": false,
            "classes": [
                "조재형",
                "조홍근",
                "임성열",
                "류홍걸"
            ]
        },
        {
            "date": "2026-08-12",
            "day": "수",
            "week": 5,
            "subject": "sLLM 구현 및 Fine Tunning",
            "holiday": false,
            "classes": [
                "한성훈",
                "류홍걸",
                "차가을",
                "임성열"
            ]
        },
        {
            "date": "2026-08-13",
            "day": "목",
            "week": 5,
            "subject": "sLLM 구현 및 Fine Tunning",
            "holiday": false,
            "classes": [
                "한성훈",
                "류홍걸",
                "차가을",
                "임성열"
            ]
        },
        {
            "date": "2026-08-14",
            "day": "금",
            "week": 5,
            "subject": "실전 Feature Engineering",
            "holiday": false,
            "classes": [
                "한성훈",
                "류홍걸",
                "차가을",
                "이은호"
            ]
        },
        {
            "date": "2026-08-17",
            "day": "월",
            "week": null,
            "subject": "대체휴일 (광복절)",
            "holiday": true,
            "classes": [
                null,
                null,
                null,
                null
            ]
        },
        {
            "date": "2026-08-18",
            "day": "화",
            "week": 6,
            "subject": "Front-framework: Vue.js",
            "holiday": false,
            "classes": [
                "우재남",
                "강병호",
                "이애본",
                "김일한"
            ]
        },
        {
            "date": "2026-08-19",
            "day": "수",
            "week": 6,
            "subject": "Front-framework: Vue.js",
            "holiday": false,
            "classes": [
                "우재남",
                "강병호",
                "이애본",
                "김일한"
            ]
        },
        {
            "date": "2026-08-20",
            "day": "목",
            "week": 6,
            "subject": "Front-framework: Vue.js",
            "holiday": false,
            "classes": [
                "우재남",
                "강병호",
                "정동엽",
                "김일한"
            ]
        },
        {
            "date": "2026-08-21",
            "day": "금",
            "week": 6,
            "subject": "Front-framework: Vue.js",
            "holiday": false,
            "classes": [
                "우재남",
                "강병호",
                "이애본",
                "김일한"
            ]
        },
        {
            "date": "2026-08-24",
            "day": "월",
            "week": 7,
            "subject": "컨테이너 이해 및 애플리케이션 컨테이너화",
            "holiday": false,
            "classes": [
                "이현민",
                "정윤석",
                "이해경",
                "신인철"
            ]
        },
        {
            "date": "2026-08-25",
            "day": "화",
            "week": 7,
            "subject": "컨테이너 이해 및 애플리케이션 컨테이너화",
            "holiday": false,
            "classes": [
                "이현민",
                "정윤석",
                "이해경",
                "신인철"
            ]
        },
        {
            "date": "2026-08-26",
            "day": "수",
            "week": 7,
            "subject": "쿠버네티스 이해 및 애플리케이션 배포",
            "holiday": false,
            "classes": [
                "이현민",
                "정환열",
                "정윤석",
                "신인철"
            ]
        },
        {
            "date": "2026-08-27",
            "day": "목",
            "week": 7,
            "subject": "쿠버네티스 이해 및 애플리케이션 배포",
            "holiday": false,
            "classes": [
                "이현민",
                "정환열",
                "정윤석",
                "신인철"
            ]
        },
        {
            "date": "2026-08-28",
            "day": "금",
            "week": 7,
            "subject": "특강(취업특강)",
            "holiday": false,
            "classes": [
                "최헌영",
                "최헌영",
                "최헌영",
                "최헌영"
            ]
        },
        {
            "date": "2026-08-29",
            "day": "토",
            "week": 7,
            "subject": "특강(취업특강), 12시 종료(8시~12시, 식당O)",
            "holiday": false,
            "classes": [
                "최헌영",
                "최헌영",
                "최헌영",
                "최헌영"
            ]
        },
        {
            "date": "2026-08-31",
            "day": "월",
            "week": 8,
            "subject": "Spring AI",
            "holiday": false,
            "classes": [
                "윤재성",
                "송영옥",
                "조재형",
                "정윤석"
            ]
        },
        {
            "date": "2026-09-01",
            "day": "화",
            "week": 8,
            "subject": "Spring AI",
            "holiday": false,
            "classes": [
                "윤재성",
                "송영옥",
                "조재형",
                "정윤석"
            ]
        },
        {
            "date": "2026-09-02",
            "day": "수",
            "week": 8,
            "subject": "웹 서비스 개발 mini-Project",
            "holiday": false,
            "classes": [
                "조재형",
                "조홍근",
                "강병호",
                "윤재성"
            ]
        },
        {
            "date": "2026-09-03",
            "day": "목",
            "week": 8,
            "subject": "웹 서비스 개발 mini-Project",
            "holiday": false,
            "classes": [
                "조재형",
                "조홍근",
                "강병호",
                "윤재성"
            ]
        },
        {
            "date": "2026-09-04",
            "day": "금",
            "week": 8,
            "subject": "웹 서비스 개발 mini-Project",
            "holiday": false,
            "classes": [
                "조재형",
                "조홍근",
                "강병호",
                "윤재성"
            ]
        },
        {
            "date": "2026-09-07",
            "day": "월",
            "week": 9,
            "subject": "머신러닝 및 딥러닝 이해",
            "holiday": false,
            "classes": [
                "김성영",
                "박병선",
                "류홍걸",
                "김준범"
            ]
        },
        {
            "date": "2026-09-08",
            "day": "화",
            "week": 9,
            "subject": "머신러닝 및 딥러닝 이해",
            "holiday": false,
            "classes": [
                "김성영",
                "박병선",
                "류홍걸",
                "김준범"
            ]
        },
        {
            "date": "2026-09-09",
            "day": "수",
            "week": 9,
            "subject": "머신러닝 및 딥러닝 이해",
            "holiday": false,
            "classes": [
                "김성영",
                "박병선",
                "류홍걸",
                "김준범"
            ]
        },
        {
            "date": "2026-09-10",
            "day": "목",
            "week": 9,
            "subject": "모델 개발 및 최적화",
            "holiday": false,
            "classes": [
                "김성영",
                "류홍걸",
                "이은호",
                "김준범"
            ]
        },
        {
            "date": "2026-09-11",
            "day": "금",
            "week": 9,
            "subject": "모델 개발 및 최적화",
            "holiday": false,
            "classes": [
                "김성영",
                "류홍걸",
                "이은호",
                "김준범"
            ]
        },
        {
            "date": "2026-09-14",
            "day": "월",
            "week": 10,
            "subject": "쿠버네티스 실무 심화",
            "holiday": false,
            "classes": [
                "정윤석",
                "신인철",
                "송영옥",
                "박보경"
            ]
        },
        {
            "date": "2026-09-15",
            "day": "화",
            "week": 10,
            "subject": "쿠버네티스 실무 심화",
            "holiday": false,
            "classes": [
                "정윤석",
                "신인철",
                "송영옥",
                "박보경"
            ]
        },
        {
            "date": "2026-09-16",
            "day": "수",
            "week": 10,
            "subject": "쿠버네티스 실무 심화",
            "holiday": false,
            "classes": [
                "정윤석",
                "신인철",
                "송영옥",
                "박보경"
            ]
        },
        {
            "date": "2026-09-17",
            "day": "목",
            "week": 10,
            "subject": "특강 (도메인특강, 프로젝트 현장 사례)",
            "holiday": false,
            "classes": [
                null,
                null,
                null,
                null
            ]
        },
        {
            "date": "2026-09-18",
            "day": "금",
            "week": 10,
            "subject": "생성형 AI 서비스 개발의 이해/활용 (LangChain)",
            "holiday": false,
            "classes": [
                "권기창",
                "김범준",
                "김영희",
                "김경난"
            ]
        },
        {
            "date": "2026-09-21",
            "day": "월",
            "week": 11,
            "subject": "생성형 AI 서비스 개발의 이해/활용 (LangChain)",
            "holiday": false,
            "classes": [
                "권기창",
                null,
                "김영희",
                "김경난"
            ]
        },
        {
            "date": "2026-09-22",
            "day": "화",
            "week": 11,
            "subject": "생성형 AI 서비스 개발의 이해/활용 (LangChain)",
            "holiday": false,
            "classes": [
                "권기창",
                "김범준",
                "김영희",
                "김경난"
            ]
        },
        {
            "date": "2026-09-23",
            "day": "수",
            "week": null,
            "subject": "자체휴강",
            "holiday": true,
            "classes": [
                null,
                null,
                null,
                null
            ]
        },
        {
            "date": "2026-09-24",
            "day": "목",
            "week": null,
            "subject": "추석연휴",
            "holiday": true,
            "classes": [
                null,
                null,
                null,
                null
            ]
        },
        {
            "date": "2026-09-25",
            "day": "금",
            "week": null,
            "subject": "추석연휴",
            "holiday": true,
            "classes": [
                null,
                null,
                null,
                null
            ]
        },
        {
            "date": "2026-09-26",
            "day": "토",
            "week": null,
            "subject": "추석연휴",
            "holiday": true,
            "classes": [
                null,
                null,
                null,
                null
            ]
        },
        {
            "date": "2026-09-27",
            "day": "일",
            "week": null,
            "subject": "추석연휴",
            "holiday": true,
            "classes": [
                null,
                null,
                null,
                null
            ]
        },
        {
            "date": "2026-09-28",
            "day": "월",
            "week": 12,
            "subject": "RAG Pipeline 설계 및 구축",
            "holiday": false,
            "classes": [
                "박보경",
                "박병선",
                "박창렴",
                "김경난"
            ]
        },
        {
            "date": "2026-09-29",
            "day": "화",
            "week": 12,
            "subject": "RAG Pipeline 설계 및 구축",
            "holiday": false,
            "classes": [
                "박보경",
                "박병선",
                "박창렴",
                "김경난"
            ]
        },
        {
            "date": "2026-09-30",
            "day": "수",
            "week": 12,
            "subject": "RAG Pipeline 설계 및 구축",
            "holiday": false,
            "classes": [
                "박보경",
                "박병선",
                "박창렴",
                "김경난"
            ]
        },
        {
            "date": "2026-10-01",
            "day": "목",
            "week": 12,
            "subject": "데이터 분석 mini-Project",
            "holiday": false,
            "classes": [
                "김경난",
                "박창렴",
                "박병선",
                "박보경"
            ]
        },
        {
            "date": "2026-10-02",
            "day": "금",
            "week": 12,
            "subject": "데이터 분석 mini-Project",
            "holiday": false,
            "classes": [
                "김경난",
                "박창렴",
                "박병선",
                "박보경"
            ]
        },
        {
            "date": "2026-10-05",
            "day": "월",
            "week": null,
            "subject": "대체휴일(개천절)",
            "holiday": true,
            "classes": [
                null,
                null,
                null,
                null
            ]
        },
        {
            "date": "2026-10-06",
            "day": "화",
            "week": 13,
            "subject": "모델 서빙 및 AIOps 구성",
            "holiday": false,
            "classes": [
                "이애본",
                "류홍걸",
                "김준범",
                "임성열"
            ]
        },
        {
            "date": "2026-10-07",
            "day": "수",
            "week": 13,
            "subject": "모델 서빙 및 AIOps 구성",
            "holiday": false,
            "classes": [
                "이애본",
                "류홍걸",
                "김준범",
                "임성열"
            ]
        },
        {
            "date": "2026-10-08",
            "day": "목",
            "week": 13,
            "subject": "모델 서빙 및 AIOps 구성",
            "holiday": false,
            "classes": [
                "이애본",
                "류홍걸",
                "김준범",
                "임성열"
            ]
        },
        {
            "date": "2026-10-09",
            "day": "금",
            "week": null,
            "subject": "한글날",
            "holiday": true,
            "classes": [
                null,
                null,
                null,
                null
            ]
        },
        {
            "date": "2026-10-12",
            "day": "월",
            "week": 14,
            "subject": "AI Agent 설계 및 구축",
            "holiday": false,
            "classes": [
                "권기창",
                "박창렴",
                "이애본",
                "김경난"
            ]
        },
        {
            "date": "2026-10-13",
            "day": "화",
            "week": 14,
            "subject": "AI Agent 설계 및 구축",
            "holiday": false,
            "classes": [
                "권기창",
                "박창렴",
                "이애본",
                "김경난"
            ]
        },
        {
            "date": "2026-10-14",
            "day": "수",
            "week": 14,
            "subject": "Vector DB",
            "holiday": false,
            "classes": [
                "이애본",
                "백정열",
                "박창렴",
                "김경난"
            ]
        },
        {
            "date": "2026-10-15",
            "day": "목",
            "week": 14,
            "subject": "AI Agent Capstone",
            "holiday": false,
            "classes": [
                "이애본",
                "이현민",
                "박창렴",
                "김경난"
            ]
        },
        {
            "date": "2026-10-16",
            "day": "금",
            "week": 14,
            "subject": "AI Agent Capstone",
            "holiday": false,
            "classes": [
                "이애본",
                "이현민",
                "박창렴",
                "김경난"
            ]
        },
        {
            "date": "2026-10-19",
            "day": "월",
            "week": 15,
            "subject": "AI Agent Capstone",
            "holiday": false,
            "classes": [
                "이애본",
                "이현민",
                "박창렴",
                "김경난"
            ]
        },
        {
            "date": "2026-10-20",
            "day": "화",
            "week": 15,
            "subject": "AI 서비스 개발 Mini-project",
            "holiday": false,
            "classes": [
                "이애본",
                "박창렴",
                "이현민",
                "김경난"
            ]
        },
        {
            "date": "2026-10-21",
            "day": "수",
            "week": 15,
            "subject": "AI 서비스 개발 Mini-project",
            "holiday": false,
            "classes": [
                "이애본",
                "박창렴",
                "이현민",
                "김경난"
            ]
        },
        {
            "date": "2026-10-22",
            "day": "목",
            "week": 15,
            "subject": "AI 서비스 개발 Mini-project",
            "holiday": false,
            "classes": [
                "이애본",
                "박창렴",
                "이현민",
                "김경난"
            ]
        },
        {
            "date": "2026-10-23",
            "day": "금",
            "week": 15,
            "subject": "DevOps 이해 및 활용",
            "holiday": false,
            "classes": [
                "정윤석",
                "신인철",
                "정경윤",
                "김경난"
            ]
        },
        {
            "date": "2026-10-26",
            "day": "월",
            "week": 16,
            "subject": "DevOps 이해 및 활용",
            "holiday": false,
            "classes": [
                "정윤석",
                "신인철",
                "정경윤",
                "김경난"
            ]
        },
        {
            "date": "2026-10-27",
            "day": "화",
            "week": 16,
            "subject": "AI 프로젝트 방법론",
            "holiday": false,
            "classes": [
                "백정열",
                "백정열",
                "백정열",
                "백정열"
            ]
        },
        {
            "date": "2026-10-28",
            "day": "수",
            "week": 16,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "강병호",
                "조홍근",
                "하만석",
                "백정열"
            ]
        },
        {
            "date": "2026-10-29",
            "day": "목",
            "week": 16,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "강병호",
                "조홍근",
                "박창렴",
                "박병선"
            ]
        },
        {
            "date": "2026-10-30",
            "day": "금",
            "week": 16,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "강병호",
                "조홍근",
                "박창렴",
                "박병선"
            ]
        },
        {
            "date": "2026-11-02",
            "day": "월",
            "week": 17,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "류홍걸",
                "김준범",
                "강병호",
                "이용우"
            ]
        },
        {
            "date": "2026-11-03",
            "day": "화",
            "week": 17,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "류홍걸",
                "김준범",
                "강병호",
                "이용우"
            ]
        },
        {
            "date": "2026-11-04",
            "day": "수",
            "week": 17,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "류홍걸",
                "김준범",
                "강병호",
                "이용우"
            ]
        },
        {
            "date": "2026-11-05",
            "day": "목",
            "week": 17,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "강병호",
                "하만석",
                "류홍걸",
                "박창렴"
            ]
        },
        {
            "date": "2026-11-06",
            "day": "금",
            "week": 17,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "강병호",
                "하만석",
                "류홍걸",
                "박창렴"
            ]
        },
        {
            "date": "2026-11-09",
            "day": "월",
            "week": 18,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "강병호",
                "하만석",
                "박창렴",
                "류홍걸"
            ]
        },
        {
            "date": "2026-11-10",
            "day": "화",
            "week": 18,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "강병호",
                "하만석",
                "박창렴",
                "류홍걸"
            ]
        },
        {
            "date": "2026-11-11",
            "day": "수",
            "week": 18,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "박병선",
                "강병호",
                "류홍걸",
                "임성열"
            ]
        },
        {
            "date": "2026-11-12",
            "day": "목",
            "week": 18,
            "subject": "팀프로젝트 (중간점검)",
            "holiday": false,
            "classes": [
                "박병선",
                "강병호",
                "류홍걸",
                "임성열"
            ]
        },
        {
            "date": "2026-11-13",
            "day": "금",
            "week": 18,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "박병선",
                "강병호",
                "류홍걸",
                "임성열"
            ]
        },
        {
            "date": "2026-11-16",
            "day": "월",
            "week": 19,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "박창렴",
                "류홍걸",
                "정윤석",
                "강병호"
            ]
        },
        {
            "date": "2026-11-17",
            "day": "화",
            "week": 19,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "박창렴",
                "류홍걸",
                "정윤석",
                "강병호"
            ]
        },
        {
            "date": "2026-11-18",
            "day": "수",
            "week": 19,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "박창렴",
                "류홍걸",
                "정윤석",
                "강병호"
            ]
        },
        {
            "date": "2026-11-19",
            "day": "목",
            "week": 19,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "박창렴",
                "류홍걸",
                "SK",
                "강병호"
            ]
        },
        {
            "date": "2026-11-20",
            "day": "금",
            "week": 19,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "박창렴",
                "류홍걸",
                "SK",
                "강병호"
            ]
        },
        {
            "date": "2026-11-23",
            "day": "월",
            "week": 20,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "류홍걸",
                "박창렴",
                "강병호",
                "이현민"
            ]
        },
        {
            "date": "2026-11-24",
            "day": "화",
            "week": 20,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "류홍걸",
                "백정열",
                "강병호",
                "이현민"
            ]
        },
        {
            "date": "2026-11-25",
            "day": "수",
            "week": 20,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "류홍걸",
                "백정열",
                "강병호",
                "임성열"
            ]
        },
        {
            "date": "2026-11-26",
            "day": "목",
            "week": 20,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "류홍걸",
                "권기창",
                "강병호",
                "임성열"
            ]
        },
        {
            "date": "2026-11-27",
            "day": "금",
            "week": 20,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "류홍걸",
                "권기창",
                "강병호",
                "임성열"
            ]
        },
        {
            "date": "2026-11-30",
            "day": "월",
            "week": 21,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "이현민",
                "류홍걸",
                "박창렴",
                "강병호"
            ]
        },
        {
            "date": "2026-12-01",
            "day": "화",
            "week": 21,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "이현민",
                "류홍걸",
                "박창렴",
                "강병호"
            ]
        },
        {
            "date": "2026-12-02",
            "day": "수",
            "week": 21,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "이현민",
                "류홍걸",
                "박창렴",
                "강병호"
            ]
        },
        {
            "date": "2026-12-03",
            "day": "목",
            "week": 21,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "임성열",
                "류홍걸",
                "박창렴",
                "강병호"
            ]
        },
        {
            "date": "2026-12-04",
            "day": "금",
            "week": 21,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "임성열",
                "류홍걸",
                "박창렴",
                "강병호"
            ]
        },
        {
            "date": "2026-12-07",
            "day": "월",
            "week": 22,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "강병호",
                "SK",
                "박창렴",
                "류홍걸"
            ]
        },
        {
            "date": "2026-12-08",
            "day": "화",
            "week": 22,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "강병호",
                "백정열",
                "박창렴",
                "류홍걸"
            ]
        },
        {
            "date": "2026-12-09",
            "day": "수",
            "week": 22,
            "subject": "팀프로젝트",
            "holiday": false,
            "classes": [
                "강병호",
                "백정열",
                "임성열",
                "류홍걸"
            ]
        },
        {
            "date": "2026-12-10",
            "day": "목",
            "week": 22,
            "subject": "최종평가(예선)",
            "holiday": false,
            "classes": [
                "강병호",
                "백정열",
                "임성열",
                "류홍걸"
            ]
        },
        {
            "date": "2026-12-11",
            "day": "금",
            "week": 22,
            "subject": "최종평가(본선) / 수료식 (16시 종료)",
            "holiday": false,
            "classes": [
                "강병호",
                "SK",
                "임성열",
                "류홍걸"
            ]
        }
    ];

    var CLASS_LABELS = { "1": "1반 (201호)", "2": "2반 (202호)", "3": "3반 (204호)", "4": "4반 (205호)" };

    // 특정 반의 시선으로 본 일정 목록. professor는 그 반의 담당 교수 (없으면 null).
    function forClass(classNo) {
        var idx = Number(classNo) - 1;
        return ENTRIES.map(function (e) {
            return {
                date: e.date,
                day: e.day,
                week: e.week,
                subject: e.subject,
                holiday: e.holiday,
                professor: e.holiday ? null : (e.classes[idx] || null)
            };
        });
    }

    window.Curriculum = {
        CLASS_LABELS: CLASS_LABELS,
        entries: ENTRIES,
        forClass: forClass
    };
})();
