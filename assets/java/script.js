var searchButton = document.querySelector("#search-button");

function searchApi(cityName) {
  var apiKey = "578a74d026d0cdbb7cd49c97bdfad734";
  var queryURL =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    APIKey;

  getUserInput();
  fetch(queryURL);
}

function getUserInput(event) {
  event.preventDefault();

  var cityName = document.querySelector("#search-input").value;

  if (!cityName) {
    console.log("forgot city name");
    return;
  }
  console.log(cityName);
//   searchApi(cityName);
}

searchButton.addEventListener("click", getUserInput);

//EventListener invokes the handleFormSubmit button passing event.
//handleSearchFormSubmit invokes the searchApi function passing inputValue.
