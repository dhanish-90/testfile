const cryptoDataContainer = document.getElementById("cryptoData");

let cryptoData = []; // Store the fetched data

// Fetch data using async/await
async function fetchData() {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false");
    const data = await response.json();
    cryptoData = data;  // Save the fetched data to the global variable
    renderData(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Render data in a table format
function renderData(data) {
  cryptoDataContainer.innerHTML = ''; // Clear previous data

  data.forEach(crypto => {
    const cryptoRow = `
      <div class="crypto-row">
        <div class="crypto-info">
          <img alt="${crypto.name} logo" src="${crypto.image}" />
          <span>${crypto.symbol}</span>
        </div>
        <div>$${crypto.current_price.toLocaleString()}</div>
        <div>$${crypto.total_volume.toLocaleString()}</div>
        <div class="${crypto.price_change_percentage_24h > 0 ? 'text-green' : 'text-red'}">
          ${crypto.price_change_percentage_24h.toFixed(2)}%
        </div>
        <div>Mkt Cap: $${crypto.market_cap.toLocaleString()}</div>
      </div>
    `;
    cryptoDataContainer.innerHTML += cryptoRow;
  });
}

// Search functionality
document.getElementById('search').addEventListener('input', (event) => {
  const query = event.target.value.toLowerCase();
  const filteredData = cryptoData.filter(crypto =>
    crypto.name.toLowerCase().includes(query) || crypto.symbol.toLowerCase().includes(query)
  );
  renderData(filteredData);
});

// Sort by Market Cap
document.getElementById('sortMarketCap').addEventListener('blur', () => { // Trigger sort when input loses focus
  const sortedData = [...cryptoData].sort((a, b) => b.market_cap - a.market_cap); // Ensure numbers are compared
  renderData(sortedData);
});

// Sort by Percentage Change
document.getElementById('sortPercentage').addEventListener('blur', () => { // Trigger sort when input loses focus
  const sortedData = [...cryptoData].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h); // Ensure numbers are compared
  renderData(sortedData);
});

// Fetch data initially
fetchData();
