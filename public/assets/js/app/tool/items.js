// Importing the variables
import { 
    oCharacter    
} from './settings.js';

//These functions deal with adding, altering or removing professions from the character
//obj: The profession that is being parsed
function itemAdd(obj) {
    if (typeof obj === 'object') {
        oCharacter.profession.push(obj);
        experienceSpend(calculateProfessionCost(obj));
    } else {
        console.error("itemAdd is not an object: " +$.type(obj));
    }
}

//This function will remove a profession to the character
//obj: The profession that is being parsed
function itemRemove(obj) {
    if (typeof obj === 'object') {
        
    } else {
        console.error("itemRemove is not an object: " +$.type(obj));
    }
}

export {
    itemAdd,
    itemRemove,
}