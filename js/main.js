import resolveDayName from "./daysResolver.js";
import showDialog from "./dialog.js";
import searchLocation from "./searchLocation.js";
import { addLocation } from "./searchLocation.js";
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
        updateIntervalInput: document.querySelector("#settingsIntervalInput"),
        manageLocationsButton: document.querySelector("#manageLocationsButton"),
        saveButton: document.querySelector("#saveSettings"),
        resetButton: document.querySelector("#resetSettings"),
        manageLocations: {
            screensSelection: {
                removeLocations: document.querySelector("#locationScreenSelectionRemove"),
                searchLocations: document.querySelector("#loacationScreenSelectionSearch"),
                setCoordinates: document.querySelector("#loacationScreenSelectionCoordinates"),
            },
            screens: {
                removeLocations: document.querySelector("#removeLocationsScreen"),
                searchLocations: document.querySelector("#searchLocationScreen"),
                setCoordinates: document.querySelector("#setCoordinatesScreen"),
            },
            window: document.querySelector("#manageLocations"),
            searchForm: document.querySelector("#searchLocationScreen form"),
            resultsArea: document.querySelector("#searchResults"),
            resultsResponse: null,
            resultsItems: null,
            saveButton: document.querySelector("#manageLocationsSave"),
            coordinatesForm: document.querySelector("#setCoordiantesForm"),
            printSavedLocations: function(){
                this.screens.removeLocations.innerHTML = "<p>Kliknutím místo odstraníte.</p>";
                if(settings.location.length == 0){
                    this.screens.removeLocations.innerHTML = "<p>Nejsou uložena žádná místa.</p>";
                }
                for(let i = 0; i < settings.location.length; i++){
                    let box = document.createElement("div");
                    let locationName = document.createElement("span");
                    let coordinates = document.createElement("span");

                    box.classList.add("locationBox");
                    box.id = `item${i}`;
                    box.classList.add("savedLocation");
                    locationName.classList.add("locationName");
                    coordinates.classList.add("locationCoordinates")

                    locationName.textContent = settings.location[i].locationName;
                    coordinates.textContent = `${settings.location[i].latitude} s. š., ${settings.location[i].longitude} v. d.`;

                    box.appendChild(locationName);
                    box.appendChild(coordinates);
                    this.screens.removeLocations.appendChild(box);

                    
                    box.addEventListener("click", ()=>{
                        let index = box.id.slice(4);
                        settings.location.splice(index, 1);
                        this.printSavedLocations();
                    });
                }
            },
        },
        loadSettings: function(){
            this.apiInput.value = settings.apiKey;
            this.updateIntervalInput.value = settings.updateInterval/1000;
        },
    },
    aboutApp: {
        screen: document.querySelector("#aboutApp"),
    }
}
const navSelectedLocationDiv = document.querySelector("#navSelectedLocation");
const navSelectedLocationText =  document.querySelector("#navSelectedLocation span");
const navLocationsList = document.querySelector("#navLocationsList");
let navLocationsListOpen = false;
let menuOpen = false;
let weatherData = {
    currentWeather: null,
    forecast: null,
};

// Nabídka
function setNavSelectedLocationText(){
    let navLocationText;
    if(settings.location.length == 0){
        navLocationText = "Nenastaveno žádné místo"
    }else{
        if(settings.location[0].locationName.length > 28){
            navLocationText = `${settings.location[0].locationName.slice(0,25)}...`
        }else{
            navLocationText = settings.location[0].locationName;
        }
    }
    navSelectedLocationText.textContent = navLocationText;
};
function writeSavedLocationsToList(){
    if(settings.location.length <= 1){
        navLocationsList.innerHTML = `<p class="navLocationListItem">Žádná další místa nejsou uložena</p>`;
        return;
    }
    for(let i = 1; i < settings.location.length; i++){
        let listItem = document.createElement("div");
        listItem.classList.add("navLocationListItem");
        listItem.id = `locationListItem${i}`;
        listItem.textContent = settings.location[i].locationName;
        navLocationsList.appendChild(listItem);

        listItem.addEventListener("click", ()=>{
            let clickedLocation = settings.location[i];
            settings.location.splice(i, 1);
            settings.location.unshift(clickedLocation);
            localStorage.setItem("settings", JSON.stringify(settings));
            location.reload();
        })
    };  
};
setNavSelectedLocationText();
writeSavedLocationsToList();

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
            menu.style.boxShadow = "2px 0px 20px #000";
            menuButton.style.backgroundImage = "url(../img/icons/close-menu.svg)";
            menuOpen = true;
            break;
        };
        case "toClose": {
            menu.style.left = "-250px";
            menu.style.boxShadow = "none";
            menuButton.style.backgroundImage = "url(../img/icons/menu.svg)";
            menuOpen = false;
            break;
        }
    }
};
navSelectedLocationDiv.addEventListener("click", ()=>{
    switch(navLocationsListOpen){
        case true: {
            navLocationsList.style.display = "none";
            navLocationsListOpen = false;
            break;
        };
        case false: {
            navLocationsList.style.display = "block";
            navLocationsListOpen = true;
            break;
        }
    }
})
// Stažení informací o počasí
loadAllWeatherData();
setInterval(loadAllWeatherData,settings.updateInterval);
function loadAllWeatherData(){
    loadWeatherData("currentWeather");
    loadWeatherData("forecast");
};


function loadWeatherData(type){
    let loadWeather = new XMLHttpRequest;
    if(settings.location.length == 0){
        showDialog("Nejsou nastavena žádná místa", "Pro zobrazení informací o počasí nejprve přidejte nějaké místo v nastavení.");
        return;
    }
    switch(type){
        case "currentWeather": {
            loadWeather.open("GET",`https://api.openweathermap.org/data/2.5/weather?lat=${settings.location[0].latitude}&lon=${settings.location[0].longitude}&lang=cz&units=metric&appid=${settings.apiKey}`, true);
            break;
        };
        case "forecast": {
            loadWeather.open("GET",`https://api.openweathermap.org/data/2.5/forecast?lat=${settings.location[0].latitude}&lon=${settings.location[0].longitude}&lang=cz&units=metric&appid=${settings.apiKey}`, true);
            break;
        };
        default: return null;
    };
    
    loadWeather.onload = function(){  
        if(this.status == 200){
            weatherData[type] = JSON.parse(this.response);
            switch(type){
                case "currentWeather": {
                    screens.currentWeather.updateScreen();
                    break;
                };
                case "forecast": {
                    screens.forecast.updateDaysList();
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
screens.settings.manageLocationsButton.addEventListener("click", ()=>{
    screens.settings.manageLocations.window.style.display = "flex";
})
screens.settings.resetButton.addEventListener("click", ()=>{
    localStorage.removeItem("settings");
    showDialog("Nastavení vymazáno", "Všechna nastavení z Vašeho prohlížeče byla vymazána a konfigurace je nyní uložena jen v dočasné paměti. Při dalším obnovení stránky se zobrazí uvítací průvodce. Pokud jste vymazali nastavení omylem, je možné tento krok zvrátit kliknutím na tlačítko <i>Uložit</i>.");
})
screens.settings.saveButton.addEventListener("click", ()=>{
    settings.apiKey = screens.settings.apiInput.value;
    settings.updateInterval = screens.settings.updateIntervalInput.value*1000;
    localStorage.setItem("settings", JSON.stringify(settings));
    showDialog("Nastavení uloženo", "Nastavení bylo uloženo. Pokud se některé změny neprojeví ihned, můžete zkusit obnovit stránku.")
})

// Správa míst
// Odebírání míst
screens.settings.manageLocations.printSavedLocations();
// Přepínání stránek
Object.keys(screens.settings.manageLocations.screensSelection).forEach((property)=>{
    screens.settings.manageLocations.screensSelection[property].addEventListener("click", ()=>{

        // Odstranit třídu "active" ze všech položek
        Object.keys(screens.settings.manageLocations.screensSelection).forEach((property2)=>{
            screens.settings.manageLocations.screensSelection[property2].classList.remove("active");
        });

        // Přidat třídu "active" na kliknutou položku
        screens.settings.manageLocations.screensSelection[property].classList.add("active");

        // Nechat zmizet všechny stránky
        Object.keys(screens.settings.manageLocations.screens).forEach((property3)=>{
            screens.settings.manageLocations.screens[property3].style.display = "none";
        })

        // Zobrazit odpovídající stránku
        screens.settings.manageLocations.screens[property].style.display = "block"
        if(property == "removeLocations"){
            screens.settings.manageLocations.printSavedLocations();
        }
    });
});
// Hledání 
screens.settings.manageLocations.searchForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    searchLocation(e.target.searchInput.value, screens.settings.manageLocations.resultsResponse, screens.settings.manageLocations.resultsArea, screens.settings.manageLocations.resultsItems, "add", settings);
})
// Zadání podle souřadnic
screens.settings.manageLocations.coordinatesForm.addEventListener("submit", (e)=>{
    e.preventDefault();

    for(let i = 0; i <= e.target.elements.length-2; i++){
        if(e.target[i].value == ""){
            showDialog("Neúplné údaje", "Prosím vyplňte všechny údaje o místě, které chcete přidat.");
            break;
        }
        if(i == e.target.elements.length-2){
            if((e.target.latitude.value >= -90 && e.target.latitude.value <= 90) && (e.target.longitude.value >= -180 && e.target.longitude.value <= 180)){
                settings.location.push(new addLocation(e.target.locationName.value, e.target.latitude.value, e.target.longitude.value));
                for(let k = 0; k <= e.target.elements.length-2; k++){
                    e.target[k].value = "";
                };
                console.log(settings.location)
            }else{
                showDialog("Neplatné souřadnice", "Zadali jste neplatné souřadnice. Zeměpisná šířka může nabývat hodnot z intervalu <-90;90> a délka z intervalu <-180;180>");
            }
        };
    };
});
// Uložení změn do localStorage
screens.settings.manageLocations.saveButton.addEventListener("click", ()=>{
    localStorage.setItem("settings", JSON.stringify(settings));
    location.reload();
})
