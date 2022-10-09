const getKey = () => {
    if (!apiKey) {
        const apiKey = prompt("Please enter Open Weather Map API Key.")
        getKey();
    };
};

getKey();

let store = [];

const renderStore = () => {
    if (localStorage.cities) {
        store = eval(localStorage.cities);

        $(".list-group").empty();

        store.forEach(city => {
            $(".list-group").prepend($(`<button onclick="forecast('${city}')">${city}</button>`));
        });
    };
};

renderStore();

const forecast = async loc => {

        if (!loc) return;

        let url = `https://api.openweathermap.org/data/2.5/forecast?q=${loc}&APPID=${apiKey}&units=imperial`;
        
        let { city, list } = await fetch(url).then(data => data.json());

        if(!store.includes(city.name)) {
            store.push(city.name);
            localStorage.cities = JSON.stringify(store);
            renderStore();
        };

        x = list;

        let $div = `<div class="ml-4">
                        <h1 class="display-3 text-center">${city.name}, ${city.country}</h1>
                        <hr>
                        <h2>${moment(list[0].dt_txt).format('llll')}</h2>
                        <h2>Temperature: ${list[0].main.temp} °F</h2>
                        <h2>Humidity: ${list[0].main.humidity}</h2>
                        <h2>Description: ${list[0].weather[0].description}</h2>
                        <img class="mainIcon" src="http://openweathermap.org/img/w/${list[0].weather[0].icon}.png">
                    </div>`
  
    $(".jumbotron").html($div);

    $(".card-deck").empty();
    for (let i = 3; i < list.length; i = i + 8) {
        const { dt_txt, main, weather } = list[i];
        
        const $card = `<div class="card text-white">
            <div class="card-body p-0">
                <p class="card-text day"> ${moment(dt_txt).format('dddd')} </p>
                <p class="card-text">Temp: ${main.temp} °F</p>
                <p class="card-text">Hum: ${main.humidity} </p>
                <p class="card-text"> ${weather[0].description} </p>
                <img class="m-auto" src="http://openweathermap.org/img/w/${weather[0].icon}.png">
            </div>
        </div>`

        $(".card-deck").append($card);
    }
};

$('.submit').on('click', () => forecast($('input').val()));