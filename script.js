// Global Variables
var searchHistory =[];
var weatherApiRootUrl = 'https://api.openweathermap.org';
var weatherApiKey = '46fcbe623f3b7ed74bbdb72d108e45c1';

// DOM element references
var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#search-input');
var todayContainer = document.querySelector('#today');
var forecastContainer = document.querySelector('#weather');
var searchHistoryContainer = document.querySelector('#history');

// Add timezone plugins to day.js
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

// Search history list display function
function getSearchHistory() {
    searchHistoryContainer.innerHTML = '';

    // Shows most recent search at top of history
    for (var x = searchHistory.length -1; x >= 0; x--) {
        var btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.setAttribute('aria-controls', 'today weather');
        btn.classList.add('history-btn', 'btn-history');

        //`data-search` allows city name acces when click handler is called
        btn.setAttribute('data-search', searchHistory[x]);
        btn.textContent = searchHistory[x];
        searchHistoryContainer.append(btn);
    }
}

//Updates history in local storage then updates the displayed history.
function  appendToHistory(search) {
    //If there is no search term then return the function
    if (searchHistory.indexOf(search) !== -1) {
        return;
    }
    searchHistory.push(search);

    localStorage.setItem('search-history', JSON.stringify(searchHistory));
    getSearchHistory();
}

// Function to get search history from local storage
function localHistoryStorage() {
    var historyStored = localStorage.getItem('search-history');
    if (historyStored) {
        searchHistory = JSON.parse(historyStored);
    }
    getSearchHistory();
}

//Function to show current weather data from OpenWeather api.
function getCurrentWeather(city, weather) {
    var date = dayjs().format('M/D/YYYY');
    // Store response data from fetch reqests in variables
    var fTemp = weather.main.temp;
    var windSpeed = weather.wind.speed;
    var humidity = weather.main.humidity;
    var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
    var iconDescription = weather.weather[0].description || weather[0].main;

    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    var heading = document.createElement('h2');
    var weatherIcon = document.createElement('img');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');

    card.setAttribute('class', 'card');
    cardBody.setAttribute('class', 'card-body');
    card.append(cardBody);

    heading.setAttribute('class', 'h3 card-title');
    tempEl.setAttribute('class', 'card-text');
    windEl.setAttribute('class', 'card-text');
    humidityEl.setAttribute('class', 'card-text');

    heading.textContent = `${city} (${date})`;
    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('alt', iconDescription);
    weatherIcon.setAttribute('class', 'weather-img');
    heading.append(weatherIcon);
    tempEl.textContent = `Temp: ${fTemp}°F`;
    windEl.textContent = `Wind: ${windSpeed} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;
    cardBody.append(heading, tempEl, windEl, humidityEl);

    todayContainer.innerHTML = '';
    todayContainer.append(card);
}

//Display weather card given an object from weather api
// daily weather.
function getWeatherCard (weather) {
    // variables from api data
    var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
    var iconDescription = weather.weather[0].description;
    var fTemp = weather.main.temp;
    var humidity = weather.main.humidity;
    var windSpeed = weather.wind.speed;

    // Create card elements
    var col= document.createElement('div');
    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    var cardTitle = document.createElement('h5');
    var weatherIcon = document.createElement('img');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');

    col.append(card);
    card.append(cardBody);
    cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

    col.setAttribute('class', 'col-md');
    col.classList.add('five-day-card');
    card.setAttribute('class', 'card bg-primary h-100 text-white');
    cardBody.setAttribute('class', 'card-body p-2');
    cardTitle.setAttribute('class', 'card-title');
    tempEl.setAttribute('class', 'card-text');
    windEl.setAttribute('class', 'card-text');
    humidityEl.setAttribute('class', 'card-text');

  // Add content to elements
  cardTitle.textContent = dayjs(weather.Date_txt).format('M/D/YYYY');
  weatherIcon.setAttribute('src', iconUrl);
  weatherIcon.setAttribute('alt', iconDescription);
  tempEl.textContent = `Temp: ${fTemp} °F`;
  windEl.textContent = `Wind: ${windSpeed} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  weatherContainer.append(col);
}

// Function to display 5 day forecast
function getForecast(dailyForecast) {
    //Create unix timestamps for start and end of 5 day forecast
    var startDate = dayjs().add(1, 'day').startOf('day').unix();
    var endDate = dayjs().add(6, 'day').startOf('day').unix();

    var ColHeading = document.createElement('div');
    var heading = document.createElement('h4');

    ColHeading.setAttribute('class', 'col-12');
    heading.textContent = '5-Day Forecast: ';
    ColHeading.append(heading);

    forecastContainer.innerHTML = '';
    forecastContainer.append(ColHeading);

    for(var x = 0; x < dailyForecast.length; x++) {

        // Starts by filtering through all of the data and returns only data that falls between one day after current data
        if (dailyForecast[x].Date >= startDate && dailyForecast[x].Date < endDate) {

            // Then filters through the data and returns only data captured at noon for each day.
            if (dailyForecast[x].Date_txt.slice(11, 13) == "12") {
                getWeatherCard(dailyForecast[x]);
            } 
        }
    }
}

function getItems(city, data) {
    getCurrentWeather(city, data.list[0], data.city.timezone);
    getForecast(data.list);
}

// Fetches weather data for given location from weather geolocation
//endpoint; then, calls functions to cisplay current and forecast weather data.
function fetchWeather(location) {
    var { lat } = location;
    var { lon } = location;
    var city = location.name;
  
    var apiUrl = `${weatherApiRootUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`;
  
    fetch(apiUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        getItems(city, data);
      })
      .catch(function (err) {
        console.error(err);
      });
}

function fetchCoords(search) {
    var apiUrl = `${weatherApiRootUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherApiKey}`;
  
    fetch(apiUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (!data[0]) {
          alert('Location not found');
        } else {
          appendToHistory(search);
          fetchWeather(data[0]);
        }
      })
      .catch(function (err) {
        console.error(err);
      });
}

function correctSearchFormSubmit(e) {
    // Don't continue if there is nothing in the search form
    if (!searchInput.value) {
      return;
    }
    
    e.preventDefault();
    var search = searchInput.value.trim();
    fetchCoords(search);
    searchInput.value = '';
  }
  
  function correctSearchHistoryClick(e) {
    // Don't do search if current elements is not a search history button
    if (!e.target.matches('.btn-history')) {
      return;
    }
  
    var btn = e.target;
    var search = btn.getAttribute('data-search');
    fetchCoords(search);
  }
  
  getSearchHistory();
  searchForm.addEventListener('submit', correctSearchFormSubmit);
  searchHistoryContainer.addEventListener('click', correctSearchHistoryClick);
  