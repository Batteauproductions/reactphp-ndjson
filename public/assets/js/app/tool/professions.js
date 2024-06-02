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
function professionAdd(obj) {
    if (typeof obj === 'object') {
        characterAddTo(oCharacter.profession,obj)
    } else {
        console.error("professionAdd is not an object: " +$.type(obj));
    }
}

//This function will remove a profession to the character
//obj: The profession that is being parsed
function professionRemove(element,main_id,sub_id) {
    characterRemoveFrom(oCharacter.profession,element,main_id,sub_id)
}

export {
    professionAdd,
    professionRemove,
}