// Global Variables
var searchHistory =[];
var weatherApiRootUrl = 'https://api.openweathermap.org';
var weatherApiKey = '46fcbe623f3b7ed74bbdb72d108e45c1';

// DOM element references
var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#search-input');
var todayContainer = document.querySelector('#today');
var forecastContainer = document.querySelector('#weather');;
var searchHistoryContainer = document.querySelector('#history');

// Search history list display function
function getSearchHistory() {
    searchHistoryContainer.innerHTML = '';

// Shows most recent search at top of history
for (var x = searchHistory.length -1; x >= 0; x++) {
    var btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-controls', 'today weather');
    btn.classList.add('history-btn', 'btn-history');

    //`data-search` allows city name acces when click handler is called
    btn.setAttribute('data')
}
}