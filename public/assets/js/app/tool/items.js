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

//These functions deal with adding, altering or removing items from the character
//obj: The item that is being parsed
function itemAdd(obj) {    
    if (typeof obj === 'object') {
        characterAddTo(oCharacter.items,'item',obj)
    } else {
        console.error("itemAdd is not an object: " +$.type(obj));
    }
}

//This function will remove a items to the character
//obj: The item that is being parsed
function itemRemove(element,main_id,sub_id) {
    characterRemoveFrom(oCharacter.items,element,'item',main_id,sub_id)
}

export {
    itemAdd,
    itemRemove,
}