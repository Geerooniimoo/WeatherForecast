var myOpenWeatherKey = "";
var citiesVisited = [];
var weatherResponse;
var cors = "https://cors-anywhere.herokuapp.com/"
var fiveWeather = `api.openweathermap.org/data/2.5/forecast?q=`;

$("button").on("click", getForcast);

function getForcast(e) {
    e.preventDefault();

    const city = $("#inputPassword2").val()
    $("#inputPassword2").val("")
    citiesVisited.push(city)

    for (let i = 0; i < citiesVisited.length; i++) {
        const cityVisited = citiesVisited[i];
        var $a = `<a href="#" class="list-group-item list-group-item-action">${cityVisited}</a>`
        $(".list-group").prepend($a);
    }

    $.ajax({
        url: cors + fiveWeather + city + myOpenWeatherKey,
        method: "GET"
    })
        .then(function (response) {
            weatherResponse = response;
            const { city, list } = response;

            let $div = `<div class="ml-4">
                        <h1 class="display-2 text-center">${city.name}, ${city.country}</h1>
                        <hr>
                        <h1 class="display-3>${moment(list[0].dt_txt).format('LLLL')}</h1>
                        <h1 class="display-3>Temperature: ${parseInt((list[0].main.temp - 273.15) * 9 / 5 + 32)} Fahrenheit</h1>
                        <h1 class="display-3>Humidity: ${list[0].main.humidity}</h1>
                        <h1 class="display-3>Description: ${list[0].weather[0].description}</h1>
                        </div>`

                        $(".jumbotron").css("background-image", `url(http://openweathermap.org/img/w/${list[0].weather[0].icon}.png)`)
                        $(".jumbotron").html($div);

                        for (let i = 3; i < list.length; i=i+8) {
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
}
