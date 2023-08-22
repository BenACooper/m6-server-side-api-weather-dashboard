//https://openweathermap.org/api/geocoding-api
//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

var searchButtonEl = document.querySelector("#search-button");

function displayTodayWeather() {
  var rawData = localStorage.getItem("rawWeatherData");
  console.log(rawData);

  if (rawData) {
    var weatherData = JSON.parse(rawData);
    console.log(weatherData);

    var lat = weatherData[0].lat;
    var lon = weatherData[0].lon;

    console.log(lat);
    console.log(lon);
  }
}

function searchApi(cityName) {
  var APIKey = "578a74d026d0cdbb7cd49c97bdfad734";
  var queryURL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    ",us&appid=" +
    APIKey;
  console.log(queryURL);

  fetch(queryURL)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (data) {
      localStorage.setItem("rawWeatherData", JSON.stringify(data));
      displayTodayWeather();
    });
}

function getUserInput() {
  var cityName = document.querySelector("#search-input").value;

  if (!cityName) {
    console.log("forgot city name");
    return;
  }
  searchApi(cityName);
  console.log(cityName);
}

searchButtonEl.addEventListener("click", getUserInput);
