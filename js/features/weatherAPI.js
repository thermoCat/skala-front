/*
 * weatherAPI.js — 날씨 데이터 조회만 책임지는 모듈 (화면 그리기는 realtimeInfo.js가 담당)
 *
 * Open-Meteo 무료 API(키 불필요)로 도시 좌표 기준 현재 기온·습도를 가져온다.
 */

export const CITIES = {
    gwangju: { name: "광주광역시", lat: 35.1595, lon: 126.8526 },
    seoul: { name: "서울특별시", lat: 37.5665, lon: 126.9780 },
    busan: { name: "부산광역시", lat: 35.1796, lon: 129.0756 },
    daegu: { name: "대구광역시", lat: 35.8714, lon: 128.6014 },
    incheon: { name: "인천광역시", lat: 37.4563, lon: 126.7052 },
    daejeon: { name: "대전광역시", lat: 36.3504, lon: 127.3845 }
};

// cityKey를 받아 { name, temperature, humidity }를 돌려준다.
export async function fetchWeather(cityKey) {
    const city = CITIES[cityKey];
    if (!city) throw new Error("알 수 없는 도시: " + cityKey);

    const url = "https://api.open-meteo.com/v1/forecast"
        + "?latitude=" + city.lat
        + "&longitude=" + city.lon
        + "&current=temperature_2m,relative_humidity_2m"
        + "&timezone=Asia%2FSeoul";

    const res = await fetch(url);
    if (!res.ok) throw new Error("weather fetch failed: " + res.status);
    const data = await res.json();

    return {
        name: city.name,
        temperature: Math.round(data.current.temperature_2m),
        humidity: Math.round(data.current.relative_humidity_2m)
    };
}
