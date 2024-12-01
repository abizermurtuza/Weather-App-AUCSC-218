const apiKey = "f0583504446dd976f54f8cba2ecc652d";

document.getElementById("search-button").addEventListener("click", () => {
  const city = document.getElementById("city-input").value.trim();
  if (city) {
    getWeather(city);
  }
});

function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod === 200 || data.cod === "200") {
        document.getElementById("temperature").textContent = `${Math.round(
          data.main.temp
        )}°C`;
        document.getElementById("details").textContent =
          data.weather[0].description;
        const iconCode = data.weather[0].icon;
        document.querySelector(
          ".weather-icon"
        ).innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather icon">`;
        document.getElementById("error-message").textContent = "";
        getForecast(city);
      } else {
        document.getElementById("error-message").textContent =
          "City not found.";
      }
    })
    .catch(() => {
      document.getElementById("error-message").textContent =
        "Error fetching weather data.";
    });
}

function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod === "200") {
        const forecastCards = document.getElementById("forecast-cards");
        forecastCards.innerHTML = "";

        // Group forecasts by date
        const forecastsByDate = {};
        data.list.forEach((item) => {
          const date = item.dt_txt.split(" ")[0];
          if (!forecastsByDate[date]) {
            forecastsByDate[date] = [];
          }
          forecastsByDate[date].push(item);
        });

        // For each day, calculate min and max temps
        Object.keys(forecastsByDate)
          .slice(0, 5)
          .forEach((date) => {
            const forecasts = forecastsByDate[date];
            const temps = forecasts.map((f) => f.main.temp);
            const tempMin = Math.min(...temps);
            const tempMax = Math.max(...temps);

            const dayName = new Date(date).toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            });
            const temp = `${Math.round(tempMin)}°C / ${Math.round(tempMax)}°C`;
            const description = forecasts[0].weather[0].description;
            const iconCode = forecasts[0].weather[0].icon;

            const card = document.createElement("div");
            card.className = "forecast-card";
            card.innerHTML = `
            <h3>${dayName}</h3>
            <div class="weather-icon"><img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather icon"></div>
            <div class="temperature">${temp}</div>
            <div class="details">${description}</div>
          `;
            forecastCards.appendChild(card);
          });
      } else {
        document.getElementById("error-message").textContent =
          "Error fetching forecast data.";
      }
    })
    .catch(() => {
      document.getElementById("error-message").textContent =
        "Error fetching forecast data.";
    });
}
