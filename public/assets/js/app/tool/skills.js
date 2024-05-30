// Importing the variables
import { 
    oCharacter    
} from './settings.js';

//These functions deal with adding, altering or removing skills from the character
//obj: The skill that is being parsed
function skillAdd(obj) {
    if (typeof obj === 'object') {
        oCharacter.skills.push(obj);
        experienceSpend(obj.xp_cost);
    } else {
        console.error("skillAdd is not an object: " +$.type(obj));
    }
}

//This function will remove a skill from the character
//obj: The skill that is being parsed
function skillRemove(obj) {
    if (typeof obj === 'object') {
        oCharacter.skills.splice(obj);
        experienceRefund(obj.xp_cost);
    } else {
        console.error("skillRemove is not an object: " +$.type(obj));
    }
}

export {  
    skillAdd,
    skillRemove,    
}