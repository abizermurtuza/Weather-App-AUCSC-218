document.getElementById("search-button").addEventListener("click", function () {
  const city = document.getElementById("city-input").value;
  const apiKey = "f0583504446dd976f54f8cba2ecc652d"; // Your API key from ApiKey.txt
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const weatherResult = document.getElementById("weather-result");
      if (data.cod === 200) {
        weatherResult.innerHTML = `
                    <h2>${data.name}</h2>
                    <p>${data.weather[0].description}</p>
                    <p>Temperature: ${data.main.temp}°C</p>
                    <p>Humidity: ${data.main.humidity}%</p>
                `;
      } else {
        weatherResult.innerHTML = `<p>City not found</p>`;
      }
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
});
