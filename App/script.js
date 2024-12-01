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

        // Filter the data to get forecasts at 12:00 PM each day
        const dailyData = data.list.filter((item) =>
          item.dt_txt.includes("12:00:00")
        );

        dailyData.forEach((day) => {
          const date = new Date(day.dt_txt);
          const options = { weekday: "short", month: "short", day: "numeric" };
          const dayName = date.toLocaleDateString(undefined, options);
          const temp = `${Math.round(day.main.temp_min)}°C / ${Math.round(
            day.main.temp_max
          )}°C`;
          const description = day.weather[0].description;
          const iconCode = day.weather[0].icon;
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
