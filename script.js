// API для получения данных
const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,ripple,solana,cardano,avalanche";

// Переменные для хранения графиков
let charts = {};

// Функция для запроса данных
async function fetchCryptoData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        updateCharts(data);
    } catch (error) {
        console.error("Ошибка загрузки данных:", error);
    }
}

// Функция для построения графиков
function createChart(ctx, label, prices) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(prices.length).fill(''), // Пустые метки по оси X
            datasets: [{
                label: label,
                data: prices,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                tension: 0.4, // Сглаживание линий
                pointRadius: 0, // Убираем точки
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { display: false }, // Скрываем ось X
                y: { beginAtZero: false }
            }
        }
    });
}

// Функция обновления графиков
function updateCharts(data) {
    data.forEach(coin => {
        if (charts[coin.id]) {
            charts[coin.id].data.datasets[0].data.push(coin.current_price);
            charts[coin.id].update();
        }
    });
}

// Инициализация графиков
document.addEventListener("DOMContentLoaded", async () => {
    await fetchCryptoData();

    charts = {
        bitcoin: createChart(document.getElementById("bitcoinChart").getContext("2d"), "Bitcoin", []),
        ethereum: createChart(document.getElementById("ethereumChart").getContext("2d"), "Ethereum", []),
        ripple: createChart(document.getElementById("rippleChart").getContext("2d"), "Ripple", []),
        solana: createChart(document.getElementById("solanaChart").getContext("2d"), "Solana", []),
        cardano: createChart(document.getElementById("cardanoChart").getContext("2d"), "Cardano", []),
        avalanche: createChart(document.getElementById("avalancheChart").getContext("2d"), "Avalanche", []),
    };

    // Обновляем данные каждые 30 минут
    setInterval(fetchCryptoData, 1800000);
});
