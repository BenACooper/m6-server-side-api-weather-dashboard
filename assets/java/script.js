//https://openweathermap.org/api/geocoding-api
//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

var searchButtonEl = document.querySelector("#search-button");

function searchApi(cityName) {
  var APIKey = "578a74d026d0cdbb7cd49c97bdfad734";
  var queryURL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&appid=" +
    APIKey;
  console.log(queryURL);

  fetch(queryURL).then(function (response) {
    if (!response.ok) {
      throw response.json();
    }
    return response.json();
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

//EventListener invokes the handleFormSubmit button passing event.
//handleSearchFormSubmit invokes the searchApi function passing inputValue.
