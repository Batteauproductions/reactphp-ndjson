// Importing the variables
import { 
    oCharacter    
} from './settings.js';

// Importing the functions needed for the file
import { 
    _construct, 
    characterAddTo,
    characterRemoveFrom
} from './functions.js';

//These functions deal with adding, altering or removing skills from the character
//obj: The skill that is being parsed
function skillAdd(obj) {
    if (typeof obj === 'object') {
        characterAddTo(oCharacter.skills,'skill',obj)
    } else {
        console.error("skillAdd is not an object: " +$.type(obj));
    }
}

//This function will remove a skill from the character
//obj: The skill that is being parsed
function skillRemove(element,main_id,sub_id) {
    characterRemoveFrom(oCharacter.skills,element,'skill',main_id,sub_id)
}

export {  
    skillAdd,
    skillRemove,    
}