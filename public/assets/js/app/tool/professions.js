// Importing the variables
import { 
    oCharacter    
} from './settings.js';

// Importing the functions needed for the file
import { 
    _construct, 
    calculateProfessionCost, 
    experienceSpend,
} from './functions.js';

//These functions deal with adding, altering or removing professions from the character
//obj: The profession that is being parsed
function professionAdd(obj) {
    if (typeof obj === 'object') {
        oCharacter.profession.push(obj);
        experienceSpend(calculateProfessionCost(obj));
    } else {
        console.error("professionAdd is not an object: " +$.type(obj));
    }
}

//This function will remove a profession to the character
//obj: The profession that is being parsed
function professionRemove(obj) {
    if (typeof obj === 'object') {
        
    } else {
        console.error("professionRemove is not an object: " +$.type(obj));
    }
}

export {
    professionAdd,
    professionRemove,
}