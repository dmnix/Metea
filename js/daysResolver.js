export default function resolveDayName(dayNumber){
    switch(dayNumber){
        case 1:{
            return "Pondělí";
        };
        case 2:{
            return "Úterý";
        };
        case 3:{
            return "Středa";
        };
        case 4:{
            return "Čtvrtek";
        };
        case 5:{
            return "Pátek";
        };
        case 6:{
            return "Sobota";
        };
        case 0:{
            return "Neděle";
        }
    }
};