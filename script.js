const API_BASE = "https://api.coingecko.com/api/v3/coins";
const CURRENCIES = ["btc", "eth", "xrp", "sol", "ada", "avax"];
let charts = {};

document.addEventListener("DOMContentLoaded", () => {
    initializeCharts();
    fetchAllData();
    setInterval(fetchAllData, 60000); // Обновление каждые 1 минут

    document.getElementById("cryptoSelect").addEventListener("change", updateMainChart);
    document.getElementById("timeRange").addEventListener("change", fetchAllData);
});

// Инициализация всех графиков
function initializeCharts() {
    CURRENCIES.forEach(currency => {
        const ctx = document.getElementById(`chart${currency.toUpperCase()}`).getContext("2d");
        charts[currency] = new Chart(ctx, {
            type: "line",
            data: { labels: [], datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                elements: {
                    line: { tension: 0.2 }
                }
            }
        });
    });
}

// Получение данных с API
async function fetchAllData() {
    const days = document.getElementById("timeRange").value;
    
    for (let currency of CURRENCIES) {
        try {
            const response = await fetch(`${API_BASE}/${currency}/market_chart?vs_currency=usd&days=${days}&interval=daily`);
            const data = await response.json();
            updateChart(currency, data);
        } catch (error) {
            console.error(`Ошибка загрузки данных для ${currency.toUpperCase()}:`, error);
        }
    }
}

async function fetchAllData() {
    const days = document.getElementById("timeRange").value;

    for (let currency of CURRENCIES) {
        try {
            const response = await fetch(`${API_BASE}/${currency}/market_chart?vs_currency=usd&days=${days}&interval=daily`);
            const data = await response.json();
            console.log(`Данные для ${currency.toUpperCase()}:`, data);
            updateChart(currency, data);
        } catch (error) {
            console.error(`Ошибка загрузки данных для ${currency.toUpperCase()}:`, error);
        }
    }
}


// Обновление графиков
function updateChart(currency, data) {
    const prices = data.prices.map(p => ({ time: new Date(p[0]).toLocaleDateString(), value: p[1] }));

    // Расчёт тренда (усреднённая линия)
    const trend = calculateTrend(prices);

    charts[currency].data = {
        labels: prices.map(p => p.time),
        datasets: [
            {
                label: `Цена ${currency.toUpperCase()} (USD)`,
                data: prices.map(p => p.value),
                borderColor: "blue",
                borderWidth: 2,
                fill: false
            },
            {
                label: "Тренд",
                data: trend,
                borderColor: "red",
                borderWidth: 1,
                borderDash: [5, 5],
                fill: false
            }
        ]
    };
    charts[currency].update();
}

// Функция для вычисления тренда (усреднённое значение)
function calculateTrend(prices) {
    const trend = [];
    const windowSize = Math.floor(prices.length / 5);

    for (let i = 0; i < prices.length; i++) {
        const start = Math.max(0, i - windowSize);
        const end = Math.min(prices.length - 1, i + windowSize);
        const avg = prices.slice(start, end + 1).reduce((sum, p) => sum + p.value, 0) / (end - start + 1);
        trend.push(avg);
    }

    return trend;
}

// Обновление главного графика (при выборе валюты)
function updateMainChart() {
    const selectedCurrency = document.getElementById("cryptoSelect").value;
    document.querySelectorAll("canvas").forEach(canvas => canvas.style.display = "none");
    document.getElementById(`chart${selectedCurrency.toUpperCase()}`).style.display = "block";
}
