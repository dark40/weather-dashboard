var resultContentEl = document.querySelector("#result-content");
var SearchFormEl = document.querySelector("#search-form");

function formSearch(event) {
    event.preventDefault();

    var SearchInput = document.querySelector("#search-city");

    if(!SearchInput) {
        console.error('Please search a city!');
        return;

        // search api placed here/
    }
}