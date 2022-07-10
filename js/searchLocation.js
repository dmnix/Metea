import showDialog from "./dialog.js";
export let addLocation = function(locationName, latitude, longitude){
    this.locationName = locationName;
    this.latitude = latitude;
    this.longitude = longitude;   
}
/*
Parametry funkce searchLocations:
---------------------------------
city: string, hledané místo
resultsResponseVariable: proměnná, do které se mají uložit výsledky hledání (získaná data zpracovaná přes JSON.parse())
resultsArea: proměnná obsahující HTML element, do kterého se mají vypsat výsledky hledání
resultsElementsVariable: proměnná, do které se uloží pole již sestavených HTML bloků (div) s výsledky hledání
clickAction: string definující, co se stane po kliknutí na HTML blok (div) výsledku
    Může nabýt hodnot:
        - "set0": uloží do pole settings.locations vybraný výsledek na vždy první pozici; používá se při prvotním nastavení
        - "add": do pole settings.locations přidá vybraný výsledek vždy na konec jako další prvek pole; používá se ve správci míst
settings: proměnná s nastavením
*/
export default function searchLocation(city, resultsResponseVariable, resultsArea, resultsElementsVariable, clickAction, settings){
    let xhr = new XMLHttpRequest;
    xhr.open("GET", `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=3&appid=${settings.apiKey}`, true);
    xhr.onload = function(){
        if(xhr.status == 200){
            console.log(JSON.parse(this.response));
            resultsResponseVariable = JSON.parse(this.response);
            printResults(JSON.parse(this.response),resultsResponseVariable, resultsArea, resultsElementsVariable, clickAction, settings);
        }else {
            showDialog("Nastala chyba", `Při pokusu o vyhledání místa nastala chyba. Server vrátil tento HTTP kód: <b>${this.status}</b> a tuto odpověd: <b>${JSON.parse(this.response).message}</b>`);
        }
    };
    xhr.send();
};

function printResults(response, resultsResponseVariable, resultsArea, resultsElementsVariable, clickAction, settings){
    resultsArea.innerHTML = "";
    if(response.length == 0){
        // Pokud nebylo nic nalezeno
        let p = document.createElement("p");
        p.textContent = "Hledané místo nebylo nalezeno. Můžete ho zadat pomocí souřadnic.";
        resultsArea.appendChild(p)
    }else{ 
        // Vypsání výsleků
        
        for(let i = 0; i < response.length; i++){
            let cityName;
            let resultBox = document.createElement("div");
            let nameText = document.createElement("span");
            let coordinates = document.createElement("span");

            resultBox.classList.add("resultElement");
            resultBox.id = `result${i}`
            nameText.classList.add("resultCity");
            coordinates.classList.add("resultCoordinates");
            if(response[i].hasOwnProperty("local_names") && response[i].local_names.hasOwnProperty("cs")){
                cityName = response[i].local_names.cs;
            }else {
                cityName = response[i].name;
            };

            if(response[i].hasOwnProperty("state")){
                nameText.textContent = `${cityName}, ${response[i].state}, ${response[i].country}`;
            }else{
                nameText.textContent = `${cityName}, ${response[i].country}`;
            }
            coordinates.textContent = `${response[i].lat} s. š, ${response[i].lon} v. d.`;

            resultBox.appendChild(nameText);
            resultBox.appendChild(coordinates);
            resultsArea.appendChild(resultBox);
        };
    };

    // Přidání EventListeneru na každý div s výsledkem
    resultsElementsVariable = document.querySelectorAll(".resultElement");
    resultsElementsVariable.forEach((item)=>{
        item.addEventListener("click", ()=>{
            if(clickAction == "set0"){ // V případě "add" se na již kliknuté položky označní neodstraňuje, aby bylo jasné, které položky jsou vybrány
                resultsElementsVariable.forEach((item2)=>{
                    item2.classList.remove("active");
                });
            }
            item.classList.add("active");
            let cityNameSelected;
            let resultSelected = resultsResponseVariable[item.id.slice(6)]; // Pomocná proměnná pro zkrácení kódu

            if(resultSelected.local_names.hasOwnProperty("cs")){
                if(resultSelected.hasOwnProperty("state")){
                cityNameSelected = `${resultSelected.local_names.cs}, ${resultSelected.state}, ${resultSelected.country}`;
                }else{
                    cityNameSelected = `${resultSelected.local_names.cs}, ${resultSelected.country}`;
                };
            }else{
                if(resultSelected.hasOwnProperty("state")){
                    cityNameSelected = `${resultSelected.name}, ${resultSelected.state}, ${resultSelected.country}`
                }else{
                    cityNameSelected = `${resultSelected.name},${resultSelected.country}`;
                };
            };
            
            let settingsEntry = new addLocation(cityNameSelected, resultSelected.lat, resultSelected.lon);
            switch(clickAction){
                case "set0": {
                    settings.location[0] = settingsEntry;
                    break;
                };
                case "add": {
                    settings.location.push(settingsEntry);
                    break;
                }
            }
            
            console.log(settings.location[0]);
        })
    })
}