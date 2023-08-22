//https://openweathermap.org/api/geocoding-api
//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
//https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
//api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
var APIKey = "578a74d026d0cdbb7cd49c97bdfad734";
var searchButtonEl = document.querySelector("#search-button");
var todayContainerEl = document.querySelector("#todayContainer");

function searchForecastAPI(lat, lon) {
  var queryForecastURL =
    "api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    APIKey;
  console.log(queryForecastURL);

  fetch(queryForecastURL)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (data) {
      localStorage.setItem("forecastData", JSON.stringify(data));   
    });
}

function displayTodayWeather(tempCelsius, tempFahrenheit, humidity, windSpeed) {
  //Reset the container each call so only one set of data can display.
  while (todayContainerEl.firstChild) {
    todayContainerEl.removeChild(todayContainerEl.firstChild);
  }

  var todayTempEl = document.createElement("p");
  todayTempEl.textContent = "Temp: " + tempCelsius + " / " + tempFahrenheit;
  todayContainerEl.appendChild(todayTempEl);

  var todayWindEl = document.createElement("p");
  todayWindEl.textContent = "Wind: " + windSpeed + " MPH";
  todayContainerEl.appendChild(todayWindEl);

  var todayHumidityEl = document.createElement("p");
  todayHumidityEl.textContent = "Humidity: " + humidity + "%";
  todayContainerEl.appendChild(todayHumidityEl);
}

//Declare a function to take the response and store the desired information (temp, wind, humidity, icon) into variables.
function getTodayData() {
  var rawWeatherData = localStorage.getItem("weatherData");
  console.log(rawWeatherData);

  if (rawWeatherData) {
    var weatherData = JSON.parse(rawWeatherData);
    console.log(weatherData);

    var tempKelvin = weatherData.main.temp; //why this response an object?
    var tempFahrenheit = ((tempKelvin - 273.15) * 9) / 5 + 32;
    tempFahrenheit = tempFahrenheit.toFixed(2) + "°F";
    var tempCelsius = tempKelvin - 273.15;
    tempCelsius = tempCelsius.toFixed(2) + "°C";
    var humidity = weatherData.main.humidity;
    var windSpeed = weatherData.wind.speed;

    console.log(tempFahrenheit);
    console.log(tempCelsius);
    console.log(humidity);
    console.log(windSpeed);

    displayTodayWeather(tempCelsius, tempFahrenheit, humidity, windSpeed);
  }
}

//Declare a function to take the geo-coordinates and in making an API call to OpenWeather's 'Call current weather data' API and save the respone to local storage for use by getTodayData() and getForecastData().
function searchTodayAPI(lat, lon) {
  var queryTodayURL =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    APIKey;
  console.log(queryTodayURL);

  fetch(queryTodayURL)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (data) {
      localStorage.setItem("weatherData", JSON.stringify(data));
      getTodayData();
    });
}

//Declare a function to get the geo coordinates from the response to store them in variables and pass them to the searchTodayAPI & searchForecastAPI functions.
function getGeoCoords() {
  var rawNameData = localStorage.getItem("nameData");
  console.log(rawNameData);

  if (rawNameData) {
    var nameData = JSON.parse(rawNameData);
    console.log(nameData);

    var lat = nameData[0].lat; //why this response an array?
    var lon = nameData[0].lon;
    console.log(lat);
    console.log(lon);

    searchTodayAPI(lat, lon);
    searchForecastAPI(lat, lon);
  }
}

//Declare a function to use the stored cityName in making an API call to OpenWeather's Built-in API request by city name, then save the response in local storage for use by getGeoCoords().
function searchByCityName(cityName) {
  var queryByNameURL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    ",us&appid=" +
    APIKey;
  console.log(queryByNameURL);

  fetch(queryByNameURL)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (data) {
      localStorage.setItem("nameData", JSON.stringify(data));
      getGeoCoords();
    });
}

//Declare a function that reminds the user to enter a city name if there isn't one, and if there is it will then store the users input in a variable and pass it to the searchByCityName function.
function getUserInput() {
  var cityName = document.querySelector("#search-input").value;

  if (!cityName) {
    console.log("forgot city name");
    return;
  }
  searchByCityName(cityName);
  console.log(cityName);
}

//Event listener on search button invokes the getUserInput function.
searchButtonEl.addEventListener("click", getUserInput);
