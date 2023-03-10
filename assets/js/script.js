let store = localStorage.cities ? JSON.parse(localStorage.cities) : ['Rocky Mount'];

const renderStore = () => {
    if (store.length) {
        $(".list-group").empty();

        store.forEach(city => {
            $(".list-group").append($(`<div><button onclick="forecast('${city}')">${city}</button><span class="del">&#10060;</span></div>`));
        });
    };
};

renderStore();

const forecast = async loc => {

    if (!loc && !store.length) return;
    if (!loc && store.length) loc = store[0];

    let url1 = `https://api.openweathermap.org/geo/1.0/direct?q=${loc}&APPID=${apiKey}&limit=1`;
    let [{ lat, lon, name: city, country }] = await (await fetch(url1)).json();

    let url2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&APPID=${apiKey}&units=imperial`;

    let data = await (await fetch(url2)).json();
    x=data;
    let { daily, current: { dt, humidity, temp, uvi, weather: [{ description, icon }] } } = data;
    
    store = store.filter(obj => obj != city);
    store = [city, ...store];
    localStorage.cities = JSON.stringify(store);
    renderStore();

    currentDiv.innerHTML = `<div class="ml-4">
                    <h1>${city}, ${country}</h1>
                    <h2>${moment(dt * 1000).format('llll')}</h2>
                    <hr>
                    <h2>Temperature: ${temp} °F</h2>
                    <h2>Description: ${description}</h2>
                    <h2>Humidity: ${humidity}</h2>
                    <h2>UV Index:<span class="uvi ${uvi < 3 ? 'green' : uvi < 6 ? 'yellow' : uvi < 8 ? 'orange' : uvi < 11 ? 'red' : 'purple'}"> ${uvi} </span></h2>
                    <img class="mainIcon" src="http://openweathermap.org/img/w/${icon}.png">
                </div>`

    // $(".jumbotron").html($div);

    $(".card-deck").empty();

    for (let i = 0; i < 5; i++) {
        let { dt, humidity, uvi, temp: { max: temp }, weather: [{ description, icon }] } = daily[i];

        const $card = `<div class="card text-white">
            <div class="card-body p-0">
                <p class="card-text day"> ${moment(dt * 1000).format('dddd')} </p>
                <p class="card-text">Temp: ${temp} °F</p>
                <p class="card-text"> ${description} </p>
                <p class="card-text">Hum: ${humidity} </p>
                <p class="card-text">UVi: <span class="uvi ${uvi < 3 ? 'green' : uvi < 6 ? 'yellow' : uvi < 8 ? 'orange' : uvi < 11 ? 'red' : 'purple'}">${uvi}</span></p>
                <img class="m-auto" src="http://openweathermap.org/img/w/${icon}.png">
                </div>
            </div>`

        $(".card-deck").append($card);
    }
};

forecast();

$('#submit').on('click', () => forecast($('input').val()));