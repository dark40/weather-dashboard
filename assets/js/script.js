var resultContentEl = document.querySelector("#result-content");
var forecastEl = document.querySelector("#forecast-content");
var searchFormEl = document.querySelector("#search-form");
var myModal = document.querySelector("#myModal");
var search = document.querySelector("#search-city");

const APIKey = "19b0c5ded79046cbf68e706032a99265";



// when button is clicked, read the input and save it to local storage.
function formSearch() {

    searchInput = document.querySelector("#search-city").value;
    var searchedCity = JSON.parse(localStorage.getItem("cities")) || [];

    // check the duplicate of input
    if (searchedCity.indexOf(searchInput) === -1) {
        searchedCity.push(searchInput);

        // add the btn to the searched list
        var cityItem = document.createElement('button');
        cityItem.classList.add("btn", "btn-secondary");
        cityItem.innerHTML = searchInput;
        searchFormEl.append(cityItem);
    }
    localStorage.setItem("cities", JSON.stringify(searchedCity));

}

// remove if city name is invalid.
function remove() {
    var searchedCity = JSON.parse(localStorage.getItem("cities"));
    searchedCity.pop();
    searchFormEl.lastElementChild.remove();


    localStorage.setItem("cities", JSON.stringify(searchedCity));

}

// Load the saved city searched. 
function renderSavedCity() {

    var savedCity = JSON.parse(localStorage.getItem("cities"));

    if (savedCity !== null) {

        for (var i = 0; i < savedCity.length; i++) {

            var cityItem = document.createElement('button');
            cityItem.classList.add("btn", "btn-secondary");
            cityItem.innerHTML = savedCity[i];
            searchFormEl.append(cityItem);
        }

    } else {
        return;
    }

}

// handle the search and button click.
function handleSearchFormSubmit(event) {

    event.preventDefault();

    var searchInput = document.querySelector("#search-city").value;

    var element = event.target;

    if (element.matches("button") === true) {

        if (searchInput !== "" && element.innerHTML === "Search") {
            formSearch();
            searchCity(searchInput);
        } else if (searchInput !== "" && element.innerHTML !== "Search") {
            searchInput = element.innerHTML;
            search.textContent = searchInput;
            searchCity(searchInput);
        } else if (searchInput === "" && element.innerHTML === "Search") {
            return;
        } else if (searchInput === "" && element.innerHTML !== "Search") {
            searchInput = element.innerHTML;
            search.textContent = searchInput;
            searchCity(searchInput);
        }
    } else {
        return;
    }


}





searchFormEl.addEventListener('click', handleSearchFormSubmit);

var longitude;
var latitude;
var cityName;

// Search API to get the longitude and latitude. 
function searchCity(query) {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + APIKey;

    fetch(queryURL)
        .then(function (response) {
            if (!response.ok) {

                throw response.json();
            }

            return response.json();
        })
        .then(function (data) {
            longitude = data.coord.lon;
            latitude = data.coord.lat;
            cityName = data.name;
            searchWeather();
        })
        // handle errors and invalid search. 
        .catch(function (error) {
            console.log(error);
            console.log("City name not found, trigger modal.")
            $('#myModal').modal('show');
            remove();

        });
};

// search API to get the data based on the lon and lat.
function searchWeather() {

    var weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=minutely,hourly&appid=" + APIKey;

    fetch(weatherURL)
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }

            return response.json();
        })
        .then(function (data) {

            printResults(data);

        })
        .catch(console.err);
};


// Print the result to the format. 
function printResults(resultObj) {

    resultContentEl.replaceChildren();
    forecastEl.replaceChildren();

    var currentDate = moment().format("l");

    var resultTitle = document.createElement('h3');
    resultTitle.innerHTML = cityName + " (" + currentDate + ")" + "<img src='http://openweathermap.org/img/w/" + resultObj.current.weather[0].icon + ".png'>";

    var resultTemp = document.createElement('p');
    resultTemp.innerHTML = "Temp: " + resultObj.current.temp + " °F";

    var resultWind = document.createElement('p');
    resultWind.innerHTML = "Wind: " + resultObj.current.wind_speed + " MPH";

    var resultHumidity = document.createElement('p');
    resultHumidity.innerHTML = "Humidity: " + resultObj.current.humidity + " %";

    var resultSpan = document.createElement('span');
    resultSpan.innerHTML = resultObj.current.uvi

    var uvi = resultObj.current.uvi;
    if (uvi <= 2) {
        var style = "style = 'color:white; background-color:green;'";
    } else if (uvi > 2 && uvi <= 8) {
        var style = "style = 'color:white; background-color:orange;'";
    } else if (uvi > 8) {
        var style = "style = 'color:white; background-color:red;'";
    }

    var resultUV = document.createElement('p');
    resultUV.innerHTML = "UV Index: " + "<span " + style + ">" + uvi + "</span>";


    resultContentEl.append(resultTitle, resultTemp, resultWind, resultHumidity, resultUV);
    resultContentEl.setAttribute("style", "border: solid grey 1px; padding: 2px;")

    var forecastHeading = document.querySelector("h4");
    forecastHeading.innerHTML = "5-Day Forecast:";

    for (var i = 1; i < 6; i++) {
        var fDate = document.createElement("h5");
        fDate.innerHTML = moment().add(i, "days").format("l");
        fDate.classList.add('card-title');

        var fIcon = document.createElement("img");
        fIcon.src = "http://openweathermap.org/img/w/" + resultObj.daily[i].weather[0].icon + ".png";

        var fTemp = document.createElement('p');
        fTemp.innerHTML = "Temp: " + resultObj.daily[i].temp.day + " °F";

        var fWind = document.createElement('p');
        fWind.innerHTML = "Wind: " + resultObj.daily[i].wind_speed + " MPH";

        var fHumidity = document.createElement('p');
        fHumidity.innerHTML = "Humidity: " + resultObj.daily[i].humidity + " %";

        var card = document.createElement('div');

        card.append(fDate, fIcon, fTemp, fWind, fHumidity);
        card.classList.add("card-body", "bg-dark", "text-white");
        forecastEl.append(card);
    }

}


renderSavedCity();