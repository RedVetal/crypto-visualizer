const API_URL = "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7&interval=daily";

async function fetchCryptoData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        return data.prices.map(price => ({
            time: new Date(price[0]).toLocaleDateString(),
            value: price[1]
        }));
    } catch (error) {
        console.error("Ошибка при получении данных:", error);
        return [];
    }
}

async function createChart() {
    const cryptoData = await fetchCryptoData();

    const ctx = document.getElementById("cryptoChart").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: cryptoData.map(d => d.time),
            datasets: [{
                label: "Курс Bitcoin (USD)",
                data: cryptoData.map(d => d.value),
                borderColor: "blue",
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

createChart();
