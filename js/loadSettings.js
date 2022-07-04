let settings;
if(localStorage.getItem("settings") == null){
    location.pathname = "welcome.html";
}else{
    settings = JSON.parse(localStorage.getItem("settings"));
};