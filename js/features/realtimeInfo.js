/*
 * realtimeInfo.js — 메인 페이지 "실시간 정보" 패널의 화면 담당 (데이터 조회는 weatherAPI.js가 담당)
 *
 * <script type="module" src="realtimeInfo.js">로 불러온다.
 */
import { fetchWeather } from "./weatherAPI.js";

const select = document.getElementById("weatherCity");
const result = document.getElementById("weatherResult");

async function renderWeather(cityKey) {
    if (!result) return;

    try {
        const weather = await fetchWeather(cityKey);
        result.innerHTML =
            '<span class="weather-temp">🌡️ ' + weather.temperature + '°C</span>'
            + '<span class="weather-humidity">💧 ' + weather.humidity + '%</span>';
    } catch (e) {
        result.innerHTML = '<span class="weather-error">⚠️ 날씨 정보를 가져오지 못했습니다</span>';
    }
}

function showLoading(cityKey) {
    const option = select.querySelector('option[value="' + cityKey + '"]');
    const cityName = option ? option.textContent : "";
    result.innerHTML = '<span class="weather-loading">🔄 ' + cityName + ' 날씨 불러오는 중...</span>';
}

if (select && result) {
    select.addEventListener("change", () => {
        showLoading(select.value);
        renderWeather(select.value);
    });
    showLoading(select.value);
    renderWeather(select.value);
}
