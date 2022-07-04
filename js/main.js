import resolveDayName from "./daysResolver.js";
import showDialog from "./dialog.js";
const menu = document.querySelector("nav");
const menuButton = document.querySelector("#menuButton");
const navItem = document.querySelectorAll(".navItem");
const screens = {
    currentWeather: {
        screen: document.querySelector("#currentWeather"),
        description: document.querySelector("#currentWeatherDescription"),
        icon: document.querySelector("#currentWeatherIcon"),
        temperature: document.querySelector("#currentWeatherTemperatue"),
        percivedTemp: document.querySelector("#currentWeatherPercivedTemp"),
        windSpeed: document.querySelector("#currentWeatherWindSpeed"),
        rain: document.querySelector("#currentWeatherRain"),
        cloudiness: document.querySelector("#currentWeatherCloudiness"),
        humidity: document.querySelector("#currentWeatherHumidity"),
        pressure: document.querySelector("#currentWeatherPressure"),
        lastUpdateText: document.querySelector("#currentWeatherlastUpdate span"),
        updateScreen: function(){
            let updateTime = new Date();
            this.description.textContent = weatherData.currentWeather.weather[0].description;
            this.temperature.textContent = `${weatherData.currentWeather.main.temp.toFixed(1)} ˚C`;
            this.percivedTemp.textContent = `${weatherData.currentWeather.main.feels_like.toFixed(1)} ˚C`;
            this.windSpeed.textContent = `${weatherData.currentWeather.wind.speed} m/s`;
            if(weatherData.currentWeather.hasOwnProperty("rain")){
                this.rain.textContent = `${weatherData.currentWeather.rain["1h"]} mm`
            }else{
                this.rain.textContent = "0 mm"
            };
            this.cloudiness.textContent = `${weatherData.currentWeather.clouds.all} %`;
            this.humidity.textContent = `${weatherData.currentWeather.main.humidity} %`;
            this.pressure.textContent = `${weatherData.currentWeather.main.pressure} hPa`;
            this.icon.src = `img/icons/weather/${weatherData.currentWeather.weather[0].icon}.svg`
            this.lastUpdateText.textContent = generateLastUpdateText();
        }
    },
    forecast: {
        screen: document.querySelector("#forecast"),
        daysList: document.querySelector("#forecastDaysList"),
        listItem: null, // HTML elementy uloženy do této proměnné až po vytvoření všech elementů dnů ve funkci "this.updateDaysList"
        description: document.querySelector("#forecastSelectedDescription"),
        icon: document.querySelector("#forecastSelectedIcon"),
        temperature: document.querySelector("#forecastSelectedTemp"),
        percivedTemp: document.querySelector("#forecastSelectedPercivedTemp"),
        windSpeed: document.querySelector("#forecastSelectedWindSpeed"),
        rain: document.querySelector("#forecastSelectedRain"),
        cloudiness: document.querySelector("#forecastSelectedCloudiness"),
        humidity: document.querySelector("#forecastSelectedHumidity"),
        pressure: document.querySelector("#forecastSelectedPressure"),
        lastUpdateText: document.querySelector("#forecastlastUpdate span"),
        updateDaysList: function(){
            this.daysList.innerHTML = "";
            for(let i = 0; i <= weatherData.forecast.list.length-1; i++){
                let item = document.createElement("div");
                let itemTime = new Date((weatherData.forecast.list[i].dt)*1000);

                item.classList.add("forecastDaysListItem");
                item.id = i;
                if(i == 0) item.classList.add("active");
                item.innerHTML = `
                <img src="img/icons/weather/${weatherData.forecast.list[i].weather[0].icon}.svg">
                <p>${resolveDayName(itemTime.getDay())}<br>
                ${itemTime.getDate()}. ${itemTime.getMonth()+1}.<br>
                ${itemTime.getHours()}:${itemTime.getMinutes()}</p>`
                this.daysList.appendChild(item);
                this.updateDetails(0);
            };
            this.listItem = document.querySelectorAll(".forecastDaysListItem");
            this.listItem.forEach((item)=>{
                item.addEventListener("click", (e)=>{
                    this.listItem.forEach((item)=>{
                        item.classList.remove("active");
                    });
                    if(e.target.localName != "div"){
                        this.updateDetails(e.target.parentNode.id);
                        e.target.parentNode.classList.add("active");
                    }else{
                        this.updateDetails(e.target.id);
                        e.target.classList.add("active");
                    };
                });
            });
        },
        updateDetails: function(indexOfDay){
            this.description.textContent = weatherData.forecast.list[indexOfDay].weather[0].description;
            this.temperature.textContent = `${weatherData.forecast.list[indexOfDay].main.temp.toFixed(1)} ˚C`;
            this.percivedTemp.textContent = `${weatherData.forecast.list[indexOfDay].main.feels_like.toFixed(1)} ˚C`;
            this.windSpeed.textContent = `${weatherData.forecast.list[indexOfDay].wind.speed} m/s`;
            if(weatherData.forecast.list[indexOfDay].hasOwnProperty("rain")){
                this.rain.textContent = `${weatherData.forecast.list[indexOfDay].rain["3h"]} mm`
            }else{
                this.rain.textContent = "0 mm"
            };
            this.cloudiness.textContent = `${weatherData.forecast.list[indexOfDay].clouds.all} %`;
            this.humidity.textContent = `${weatherData.forecast.list[indexOfDay].main.humidity} %`;
            this.pressure.textContent = `${weatherData.forecast.list[indexOfDay].main.pressure} hPa`;
            this.icon.src = `img/icons/weather/${weatherData.forecast.list[indexOfDay].weather[0].icon}.svg`;
            this.lastUpdateText.textContent = generateLastUpdateText();
        },
        
    },
    settings: {
        screen: document.querySelector("#settings"),
        apiInput: document.querySelector("#settingsInputAPI"),
        latitudeInput: document.querySelector("#settingsInputLatitude"),
        longtitudeInput: document.querySelector("#settingsInputLongtitude"),
        updateIntervalInput: document.querySelector("#settingsIntervalInput"),
        saveButton: document.querySelector("#saveSettings"),
        resetButton: document.querySelector("#resetSettings"),
        loadSettings: function(){
            this.apiInput.value = settings.apiKey;
            this.latitudeInput.value = settings.latitude;
            this.longtitudeInput.value = settings.longtitude;
            this.updateIntervalInput.value = settings.updateInterval/1000;
        },
    },
    aboutApp: {
        screen: document.querySelector("#aboutApp"),
    }
}
const locationText =  document.querySelector("#location span");
let menuOpen = false;
let weatherData = {
    currentWeather: null,
    forecast: null,
};



// Nabídka
menuButton.addEventListener("click", ()=>{
    switch(menuOpen){
        case true: {
            toggleMenu("toClose");
            break;
        };
        case false: {
            toggleMenu("toOpen");
            break;
        }
    }
})
navItem.forEach((item)=>{
    item.addEventListener("click", ()=>{
        navItem.forEach((item)=>{
            item.classList.remove("active");
        });
        item.classList.toggle("active");
        for(let screen in screens){
            screens[screen].screen.style.display = "none";
        };
        switch(item.id){
            case "navCurrentWeather": {
                screens.currentWeather.screen.style.display = "block";
                break;
            };
            case "navForecast": {
                screens.forecast.screen.style.display = "block";
                break;
            }
            case "navSettings": {
                screens.settings.screen.style.display = "block";
                screens.settings.loadSettings();
                break;
            }
            case "navAboutApp": {
                screens.aboutApp.screen.style.display = "block";
            }
        };
        toggleMenu("toClose");
    })
})
function toggleMenu(action){
    switch(action){
        case "toOpen": {
            menu.style.left = "0px";
            menuButton.style.backgroundImage = "url(../img/icons/close-menu.svg)";
            menuOpen = true;
            break;
        };
        case "toClose": {
            menu.style.left = "-250px";
            menuButton.style.backgroundImage = "url(../img/icons/menu.svg)";
            menuOpen = false;
            break;
        }
    }
}

// Stažení informací o počasí
loadAllWeatherData();
setInterval(loadAllWeatherData,settings.updateInterval);
function loadAllWeatherData(){
    loadWeatherData("currentWeather");
    loadWeatherData("forecast");
};


function loadWeatherData(type){
    let loadWeather = new XMLHttpRequest;
    switch(type){
        case "currentWeather": {
            loadWeather.open("GET",`https://api.openweathermap.org/data/2.5/weather?lat=${settings.latitude}&lon=${settings.longtitude}&lang=cz&units=metric&appid=${settings.apiKey}`, true);
            break;
        };
        case "forecast": {
            loadWeather.open("GET",`https://api.openweathermap.org/data/2.5/forecast?lat=${settings.latitude}&lon=${settings.longtitude}&lang=cz&units=metric&appid=${settings.apiKey}`, true);
            break;
        };
        default: return null;
    };
    
    loadWeather.onload = function(){  
        if(this.status == 200){
            weatherData[type] = JSON.parse(this.response);
            switch(type){
                case "currentWeather":{
                    screens.currentWeather.updateScreen();
                    locationText.textContent = `${weatherData.currentWeather.name}, ${weatherData.currentWeather.sys.country}`;
                    break;
                };
                case "forecast": {
                    screens.forecast.updateDaysList();
                    locationText.textContent = `${weatherData.forecast.city.name}, ${weatherData.forecast.city.country}`;
                    break;
                }
            }
            console.log(weatherData[type]);
        }else {
            showDialog("Chyba při synchronizaci", `Při synchronizaci dat se serverem nastala chyba. Byl vrácen tento kód chyby: <b>${this.status}</b> s touto odpovědí: <b>${JSON.parse(this.response).message}</b>`)
        }
    };
loadWeather.send();
};

function generateLastUpdateText(){
    let updateTime = new Date()
    return  (`${updateTime.getDate()}. ${updateTime.getMonth()+1}. ${updateTime.getFullYear()}, ${updateTime.getHours()}:${updateTime.getMinutes()}:${updateTime.getSeconds()}`);
}

// Nastavení
screens.settings.resetButton.addEventListener("click", ()=>{
    localStorage.removeItem("settings");
    showDialog("Nastavení vymazáno", "Všechna nastavení z Vašeho prohlížeče byla vymazána a konfigurace je nyní uložena jen v dočasné paměti. Při dalším obnovení stránky se zobrazí uvítací průvodce. Pokud jste vymazali nastavení omylem, je možné tento krok zvrátit kliknutím na tlačítko <i>Uložit</i>.");
})
screens.settings.saveButton.addEventListener("click", ()=>{
    settings.apiKey = screens.settings.apiInput.value;
    settings.latitude = screens.settings.latitudeInput.value;
    settings.longtitude = screens.settings.longtitudeInput.value;
    settings.updateInterval = screens.settings.updateIntervalInput.value*1000;
    localStorage.setItem("settings", JSON.stringify(settings));
    showDialog("Nastavení uloženo", "Nastavení bylo uloženo. Pokud se některé změny neprojeví ihned, můžete zkusit obnovit stránku.")
})