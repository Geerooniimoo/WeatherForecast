const getKey = () => {
    if (!localStorage.apiKey || localStorage.apiKey == 'null') {
        localStorage.apiKey = prompt("Please enter Open Weather Map API Key.")
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

    let url1 = `https://api.openweathermap.org/geo/1.0/direct?q=${loc}&APPID=${localStorage.apiKey}&limit=1`;
    let data = await fetch(url1).then(data => data.json());
    x = data;
    let [{lat,lon,name:city,country}] = await fetch(url1).then(data => data.json());
    let url2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&APPID=${localStorage.apiKey}&units=imperial`;
    
    let {
            daily,current:{dt,humidity,temp,uvi,weather:[{description,icon}]}
        } = await fetch(url2).then(data => data.json());
        // let data = await fetch(url2).then(data => data.json());

        // x = daily;
    
    if(!store.includes(city)) {
        store.push(city);
        localStorage.cities = JSON.stringify(store);
        renderStore();
    };

    let $div = `<div class="ml-4">
                    <h1 class="display-3 text-center">${city}, ${country}</h1>
                    <hr>
                    <h2>${moment(dt*1000).format('llll')}</h2>
                    <h2>Temperature: ${temp} °F</h2>
                    <h2>Humidity: ${humidity}</h2>
                    <h2>Description: ${description}</h2>
                    <h2>UV Index:<span class="uvi ${uvi<3?'green':uvi<6?'yellow':uvi<8?'orange':uvi<11?'red':'purple'}"> ${uvi} </span></h2>
                    <img class="mainIcon" src="http://openweathermap.org/img/w/${icon}.png">
                </div>`
  
    $(".jumbotron").html($div);

    $(".card-deck").empty();

    for (let i = 0; i < 5; i++) {
        let { dt, humidity, uvi, temp:{max:temp}, weather:[{description,icon}] } = daily[i];
        
        const $card = `<div class="card text-white">
            <div class="card-body p-0">
                <p class="card-text day"> ${moment(dt*1000).format('dddd')} </p>
                <p class="card-text">Temp: ${temp} °F</p>
                <p class="card-text">Hum: ${humidity} </p>
                <p class="card-text"> ${description} </p>
                <p class="card-text">UVi: <span class="uvi ${uvi<3?'green':uvi<6?'yellow':uvi<8?'orange':uvi<11?'red':'purple'}">${uvi}</span></p>
                <img class="m-auto" src="http://openweathermap.org/img/w/${icon}.png">
                </div>
                </div>`

        $(".card-deck").append($card);
    }
};

$('.submit').on('click', () => forecast($('input').val()));