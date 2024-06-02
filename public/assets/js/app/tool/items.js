// Importing the variables
import { 
    oCharacter    
} from './settings.js';

// Importing the functions needed for the file
import { 
    _construct, 
    characterAddTo,
    characterRemoveFrom,
} from './functions.js';

//These functions deal with adding, altering or removing professions from the character
//obj: The profession that is being parsed
function itemAdd(obj) {
    if (typeof obj === 'object') {
        characterAddTo(oCharacter.items,obj)
    } else {
        console.error("itemAdd is not an object: " +$.type(obj));
    }
}

//This function will remove a profession to the character
//obj: The profession that is being parsed
function itemRemove(element,main_id,sub_id) {
    characterRemoveFrom(oCharacter.items,element,main_id,sub_id)
}

export {
    itemAdd,
    itemRemove,
}