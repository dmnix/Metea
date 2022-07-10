import showDialog from "./dialog.js";
import searchLocation from "./searchLocation.js";
import { addLocation } from "./searchLocation.js";
const nextButton = document.querySelector("#nextButton");
const backButton = document.querySelector("#backButton");
let step = 1;
let settings = {
    apiKey: null,
    updateInterval: 300000,
    location: [],
};

const wizardSteps = [
    {
        // Uvítací stránka
        screen: document.querySelector("#wizardStep1"),
    },
    {
        // API
        screen: document.querySelector("#wizardStep2"),
        apiInput: document.querySelector("#wizardStep2 input"),
        showAPIHintButton: document.querySelector("#showAPIHint"),
        apiHintText: document.querySelector("#apiHintText"),
        apiHintOpen: false,
        showAPIHint: function(){
            if(this.apiHintOpen == false){
                this.apiHintText.style.display = "block";
                this.apiHintOpen = true;
            }else{
                this.apiHintText.style.display = "none";
                this.apiHintOpen = false;
            }
        }
    },
    {
        // Umístění
        screen: document.querySelector("#wizardStep3"),
        loacationInputMethod: [
            document.querySelector("#loacationInputMethodSearch"),
            document.querySelector("#loacationInputMethodCoordinates"),
        ],
        searchLocation: {
            div: document.querySelector("#searchLocation"),
            form: document.querySelector("#searchLocation form"),
            resultsArea: document.querySelector("#searchResults"),
            resultsItems: null,
            resultsResponse: null,
        },
        setCoordinates:{
             div: document.querySelector("#setCoordinates"),
             input: document.querySelectorAll("#setCoordinates input"),
        },
    },
    {
        // Souhrn
        screen: document.querySelector("#wizardStep4"),
        summary: document.querySelector("#wizardSummary"),
    }
];

nextButton.addEventListener("click", ()=>{
    step++;
    switch(step){
        case 3: {
            if(wizardSteps[1].apiInput.value == ""){
                /* emptyInputWarningStep2.style.display = "block" */
                showDialog("Nebyl zadán API klíč", "Musí být nastaven platný API klíč, jinak nebude Metea moci stahovat informace o počasí.")
                step--;
            }else{
                settings.apiKey = wizardSteps[1].apiInput.value;
                refreshWizard();
            };
            break;
        };
        case 4: {
            let loc = settings.location;
            if(loc[0] == undefined || loc[0].locationName == "" || loc[0].latitude == "" || loc[0].longitude == "") {
                showDialog("Nebyla nastavena lokace", "Je nutné nastavit místo, pro které chcete zobrazovat počasí.");
                step--;
            }else{
                refreshWizard();
            }   
            break;
        };
        case 5: {
            localStorage.setItem("settings", JSON.stringify(settings))
            location.pathname = "index.html"
            break;
        }
        default: refreshWizard();
    }

});
backButton.addEventListener("click", ()=>{
    step--;
    refreshWizard();
});

wizardSteps[1].showAPIHintButton.addEventListener("click", ()=>{
    wizardSteps[1].showAPIHint();
})

wizardSteps[2].loacationInputMethod.forEach((item)=>{
    item.addEventListener("click", (e)=>{
        wizardSteps[2].loacationInputMethod.forEach((item2)=>{
            item2.classList.remove("active")
        })
        e.target.classList.add("active");
        switch(e.target.id){
            case "loacationInputMethodSearch": {
                wizardSteps[2].setCoordinates.div.style.display = "none";
                wizardSteps[2].searchLocation.div.style.display = "block";
                break;
            };
            case "loacationInputMethodCoordinates": {
                wizardSteps[2].searchLocation.div.style.display = "none";
                wizardSteps[2].setCoordinates.div.style.display = "block";
                break;
            }
        }
    })
})

// Hledání místa
wizardSteps[2].searchLocation.form.addEventListener("submit", (e)=>{
    e.preventDefault();
    searchLocation(e.target.searchInput.value, wizardSteps[2].searchLocation.resultsResponse, wizardSteps[2].searchLocation.resultsArea, wizardSteps[2].searchLocation.resultsItems, "set0", settings)
})

// Zadávání podle souřadnic
wizardSteps[2].setCoordinates.input.forEach((item)=>{
    let inputs = wizardSteps[2].setCoordinates.input;
    item.addEventListener("input", (e)=>{
        settings.location[0] = new addLocation(inputs[0].value, inputs[1].value, inputs[2].value);
    })
})

function refreshWizard(){
    for(let i = 0; i < wizardSteps.length; i++){
        wizardSteps[i].screen.style.display = "none";
    };
    switch(step){
        case 1: {
            wizardSteps[step-1].screen.style.display = "block";
            backButton.style.display = "none";
            break;
        };
        case 2: {
            wizardSteps[step-1].screen.style.display = "block";
            backButton.style.display = "block";
            break;
        };
        case 3: {
            wizardSteps[step-1].screen.style.display = "block";
            nextButton.textContent = "Další →"
            break;
        };
        case 4: {
            wizardSteps[step-1].screen.style.display = "block";
            nextButton.textContent = "Uložit";
            wizardSteps[3].summary.innerHTML = `API klíč: <b>${settings.apiKey}</b><br>
            Název místa: <b>${settings.location[0].locationName}</b><br>
            Zeměpisná šířka: <b>${settings.location[0].latitude}˚ s. š.</b><br>
            Zeměpisná délka: <b>${settings.location[0].longitude}° v. d.</b>`
            break;
        }
    };
}