//https://openweathermap.org/api/geocoding-api
//https://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
//https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
//https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

var APIKey = "578a74d026d0cdbb7cd49c97bdfad734";
var searchButtonEl = document.querySelector("#search-button");
var todayContainerEl = document.querySelector("#todayContainer");
var forecastContainerEl = document.querySelector("#forecastContainer");

var today = dayjs();
var todayFormatted = today.format("(DD/MM/YYYY)");

//Delcare a function to receive the arrats and iterate through them to display the corresponding set of data for each iteration. Parameters semantics are placeholders, but must match the contnet of the function. When the functoin is invoked and arguments are passed those arguments replace the parameters in all instnaces, not just witin the paranthesis.
function displayForecastWeather(
  forecastCelsius,
  forecastFahrenheit,
  forecastHumidity,
  forecastWind
) {
  // Reset the container each call so only one set of data can display.
  while (forecastContainerEl.firstChild) {
    forecastContainerEl.removeChild(forecastContainerEl.firstChild);
  }

  for (var i = 0; i < 5; i++) {
    var forecastCard = document.createElement("div");
    forecastCard.setAttribute("id", "card");
    forecastContainerEl.appendChild(forecastCard);

    var forecastDate = dayjs().add([i], "day").format("DD/MM/YYYY");
    var forecastDateEl = document.createElement("h4");
    forecastDateEl.textContent = forecastDate;
    forecastCard.appendChild(forecastDateEl);

    var forecastTempEl = document.createElement("p");
    forecastTempEl.textContent =
      "Temp: " + forecastCelsius[i] + " / " + forecastFahrenheit[i];
    forecastCard.appendChild(forecastTempEl);

    var forecastWindEl = document.createElement("p");
    forecastWindEl.textContent = "Wind: " + forecastWind[i] + " MPH";
    forecastCard.appendChild(forecastWindEl);

    var forecastHumidityEl = document.createElement("p");
    forecastHumidityEl.textContent = "Humidity: " + forecastHumidity[i] + "%";
    forecastCard.appendChild(forecastHumidityEl);
  }
}

function getForecastData() {
  var rawForecastData = localStorage.getItem("forecastData");
  console.log(rawForecastData);

  if (rawForecastData) {
    var forecastData = JSON.parse(rawForecastData);
    console.log(forecastData);

    var forecastCelsiusArr = [];
    var forecastFahrenheitArr = [];
    var forecastHumidityArr = [];
    var forecastWindArr = [];

    for (var i = 0; i < 5; i++) {
      var forecastKelvin = forecastData.list[i].main.temp;
      var forecastFahrenheit = ((forecastKelvin - 273.15) * 9) / 5 + 32;
      forecastFahrenheitArr.push(forecastFahrenheit.toFixed(2) + "°F");
      var forecastCelsius = forecastKelvin - 273.15;
      forecastCelsiusArr.push(forecastCelsius.toFixed(2) + "°C");
      forecastHumidityArr.push(forecastData.list[i].main.humidity);
      forecastWindArr.push(forecastData.list[i].wind.speed);

      console.log("Day " + [i] + " " + forecastFahrenheitArr);
      console.log("Day " + [i] + " " + forecastCelsiusArr);
      console.log("Day " + [i] + " " + forecastHumidityArr);
      console.log("Day " + [i] + " " + forecastWindArr);
    }

    // Move this line outside the for loop to display all data together.
    displayForecastWeather(
      forecastCelsiusArr,
      forecastFahrenheitArr,
      forecastHumidityArr,
      forecastWindArr
    );
  }
}

function searchForecastAPI(lat, lon) {
  var queryForecastURL =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
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
      getForecastData();
    });
}

//Can't figure out how to make the icon display.
function displayTodayWeather(
  tempCelsius,
  tempFahrenheit,
  humidity,
  windSpeed,
  todayIcon
) {
  //Reset the container each call so only one set of data can display.
  while (todayContainerEl.firstChild) {
    todayContainerEl.removeChild(todayContainerEl.firstChild);
  }
  cityName = document.querySelector("#search-input").value;
  todayCityName = document.createElement("h2");
  todayCityName.textContent = cityName + " " + todayFormatted;
  todayContainerEl.appendChild(todayCityName);

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
    var todayIcon = weatherData.weather[0].icon;

    console.log(tempFahrenheit);
    console.log(tempCelsius);
    console.log(humidity);
    console.log(windSpeed);
    console.log(todayIcon);

    displayTodayWeather(
      tempCelsius,
      tempFahrenheit,
      humidity,
      windSpeed,
      todayIcon
    );
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
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
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

//Declare a function that reminds the user to enter a city name if there isn't one, and if there is it will then store the users input in a variable for passing.
function getUserInput() {
  var cityName = document.querySelector("#search-input").value;
  if (!cityName) {
    console.log("forgot city name");
    return;
  }
  addCityButton(cityName);
  searchByCityName(cityName);
  console.log(cityName);
}

//Event listener on search button invokes the getUserInput function.
searchButtonEl.addEventListener("click", getUserInput);

//Declare function to add buttons to the div below the input.
function addCityButton(cityName) {
  // Check if a button with the same text already exists
  var existingButtons = document.querySelectorAll("#cityList button");
  for (var i = 0; i < existingButtons.length; i++) {
    if (existingButtons[i].textContent === cityName) {
      return; // City button already exists, so don't add a duplicate
    }
  }

  var addedButton = document.createElement("button");
  addedButton.textContent = cityName;

  addedButton.addEventListener("click", function () {
    searchByCityName(cityName);
  });

  var cityList = document.getElementById("cityList");
  cityList.appendChild(addedButton);
  storeCityNamesInLocalStorage()
}

//Declare function to store city names of existing buttons in localstorage.
function storeCityNamesInLocalStorage() {
  var cityButtons = document.querySelectorAll("#cityList button");
  var cityNames = [];

  for (var i = 0; i < cityButtons.length; i++) {
    cityNames.push(cityButtons[i].textContent);
  }

  localStorage.setItem("cityNames", JSON.stringify(cityNames));
}

//Declare function to retrieve the stored cityNames and make buttons.
function loadCityButtonsFromLocalStorage() {
  var cityNames = localStorage.getItem("cityNames");
  if (cityNames) {
    cityNames = JSON.parse(cityNames);
    for (var i = 0; i < cityNames.length; i++) {
      addCityButton(cityNames[i]);
    }
  }
}
loadCityButtonsFromLocalStorage() //Call when page loads.
