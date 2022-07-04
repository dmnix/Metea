import showDialog from "./dialog.js";
const nextButton = document.querySelector("#nextButton");
const backButton = document.querySelector("#backButton");
const wizardStep1 = document.querySelector("#wizardStep1");
const wizardStep2 = document.querySelector("#wizardStep2");
const wizardStep3 = document.querySelector("#wizardStep3");
const wizardStep4 = document.querySelector("#wizardStep4");
const wizardAPIInput = document.querySelector("#wizardStep2 input");
const wizardLocationInput = document.querySelectorAll("#wizardStep3 input");
const wizardLocationUnit = document.querySelectorAll("#wizardStep3 select");
const wizardSummary = document.querySelector("#wizardSummary");
const emptyInputWarningStep2 = document.querySelector("#emptyInputWarningStep2");
const emptyInputWarningStep3 = document.querySelector("#emptyInputWarningStep3");
const showAPIHint = document.querySelector("#showAPIHint");
const apiHintText = document.querySelector("#apiHintText");
let step = 1;
let settings = {
    apiKey: null,
    latitude: null,
    longtitude: null,
    updateInterval: 300000,
};
let apiHintOpen = false;

nextButton.addEventListener("click", ()=>{
    step++;
    switch(step){
        case 3: {
            if(wizardAPIInput.value == ""){
                emptyInputWarningStep2.style.display = "block"
                step--;
            }else{
                settings.apiKey = wizardAPIInput.value;
                refreshWizard();
            };
            break;
        };
        case 4: {
            if(wizardLocationInput[0].value == "" || wizardLocationInput[1].value == ""){
                emptyInputWarningStep3.style.display = "block";
                step--;
            }else{
                settings.latitude = Number(wizardLocationInput[0].value)
                settings.longtitude = Number(wizardLocationInput[1].value)
                refreshWizard();
            };
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

wizardAPIInput.addEventListener("input", (e)=>{
    if(emptyInputWarningStep2.style.display == "block"){
        emptyInputWarningStep2.style.display = "none"
    };
})
wizardLocationInput.forEach((locationInput)=>{
    locationInput.addEventListener("input", ()=>{
        emptyInputWarningStep3.style.display = "none";
        });
});
showAPIHint.addEventListener("click", ()=>{
    if(apiHintOpen == false){
        apiHintText.style.display = "block";
        apiHintOpen = true;
    }else{
        apiHintText.style.display = "none";
        apiHintOpen = false;
    }
    
})

function refreshWizard(){
    wizardStep1.style.display = "none";
    wizardStep2.style.display = "none";
    wizardStep3.style.display = "none";
    wizardStep4.style.display = "none";

    switch(step){
        case 1: {
            wizardStep1.style.display = "block";
            backButton.style.display = "none";
            break;
        };
        case 2: {
            wizardStep2.style.display = "block";
            backButton.style.display = "block";
            break;
        };
        case 3: {
            wizardStep3.style.display = "block";
            nextButton.textContent = "Další →"
            break;
        };
        case 4: {
            wizardStep4.style.display = "block";
            nextButton.textContent = "Uložit";
            wizardSummary.innerHTML = `API klíč: <b>${settings.apiKey}</b><br>Zeměpisná šířka: <b>${settings.latitude}˚ s. š.</b><br>Zeměpisná délka: <b>${settings.longtitude}° v. d.</b>`
            break;
        }
    };
}