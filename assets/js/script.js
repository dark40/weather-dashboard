var resultContentEl = document.querySelector("#result-content");
var searchFormEl = document.querySelector("#search-form");
var btnEl = document.querySelector("#searchBtn");

// when button is clicked, read the input and save it to local storage.
function formSearch() {

    searchInput = document.querySelector("#search-city").value;
    var searchedCity = JSON.parse(localStorage.getItem("cities")) || [];
    if (searchedCity.indexOf(searchInput) === -1) {
        searchedCity.push(searchInput);
    }
    localStorage.setItem("cities", JSON.stringify(searchedCity));

}

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

btnEl.addEventListener("click", function () {

    var searchInput = document.querySelector("#search-city").value;

    if (searchInput !== "") {
        formSearch();
        renderSavedCity();
        searchApi(searchInput);
    } else {
        return;
    }
})




function searchApi(query) {

    var APIKey = "19b0c5ded79046cbf68e706032a99265";
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + APIKey;

    fetch(queryURL)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    printResults(data);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect!');
        });
};



    function printResults(resultObj) {
        console.log(resultObj);

        var resultTitle = document.createElement('h3');
        resultTitle.textContent = resultObj.name + resultObj.icon;

        var resultTemp = document.createElement('p');
        resultTemp.textContent = "Temp: " + resultObj.main.temp + " °F";

        var resultWind = document.createElement('p');
        resultWind.textContent = "Wind: " + resultObj.wind.speed + " MPH";

        var resultHumidity = document.createElement('p');
        resultHumidity.textContent = "Humidity: " + resultObj.main.humidity + " %";

        var resultUV = document.createElement('p');
        resultUV.textContent = "UV Index: ";

        resultContentEl.appendChild(resultTitle, resultTemp, resultWind, resultHumidity, resultUV);
    }



renderSavedCity();