let searchedCities = [];
const cors = "https://cors-anywhere.herokuapp.com/"
const forecast = `api.openweathermap.org/data/2.5/forecast?q=`;

// ===========================RUNNING=FUNCTIONS=================================================
promptForApiKey();
showSearchedCities();
$(document).on("click", "a", searchedCitiesForecast);
$(document).on("click", "button", buttonForecast);

// ===========================1ST=FUNCTIONS=DEFINITIONS=========================================
function promptForApiKey() {
    if (!localStorage.getItem("openWeatherKey")) {
        const apiKey = "&APPID=" + prompt("Please enter Open Weather Map API Key.");
        localStorage.setItem("openWeatherKey", apiKey);
    }
}

function showSearchedCities() {
    if (localStorage.getItem("cities")) {
        searchedCities = [...localStorage.getItem("cities").split(";")];
        for (let i = 0; i < searchedCities.length; i++) {
            var $a = `<a href="#" class="list-group-item list-group-item-action">${searchedCities[i]}</a>`
            $(".list-group").prepend($a);
        };
    };
};

function searchedCitiesForecast() {
    getForecast($(this).text());
};

function buttonForecast() {
    const city = $("#inputPassword2").val()
    $("#inputPassword2").val("")
    searchedCities.push(city);
    $(".list-group").empty();
    localStorage.setItem("cities", searchedCities.join(";"));
    showSearchedCities();
    getForecast(city);
};

// ===========================2ND=FUNCTIONS=DEFINITIONS=========================================
function getForecast(city) {

    $.ajax({
        url: cors + forecast + city + localStorage.getItem("openWeatherKey"),
        method: "GET"
    })
        .then(function (response) {
            weatherResponse = response;
            const { city, list } = response;
            let $div = `<div class="ml-4">
                <h1 class="display-3">${city.name}, ${city.country}</h1>
                <hr>
                <h2>${moment(list[0].dt_txt).format('LLL')}</h2>
                <h2>Temperature:${parseInt((list[0].main.temp - 273.15) * 9 / 5 + 32)} F</h2>
                <h2>Humidity: ${list[0].main.humidity}</h2>
                <h2>Description: ${list[0].weather[0].description}</h2>
                <img class="m-auto" src="http://openweathermap.org/img/w/${list[0].weather[0].icon}.png">
            </div>`
            $(".jumbotron").html($div);

            $(".card-deck").empty();
            for (let i = 3; i < list.length; i = i + 8) {
                const { dt_txt, main, weather } = list[i];
                const $card = `<div class="card text-white">
                    <div class="card-body">
                        <p class="card-text">${moment(dt_txt).format('dddd')}</p>
                        <p class="card-text">Temp: ${parseInt((main.temp - 273.15) * 9 / 5 + 32)}</p>
                        <p class="card-text">Humid:${main.humidity}</p>
                        <p class="card-text">Desc:${weather[0].description}</p>
                        <img class="m-auto" src="http://openweathermap.org/img/w/${weather[0].icon}.png">
                    </div>
                </div>`

                $(".card-deck").append($card);
            }
        })
};