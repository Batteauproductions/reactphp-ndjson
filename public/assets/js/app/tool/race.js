// Importing the variables
import { 
    oCharacter    
} from './settings.js';

// Importing the functions needed for the file
import { 
    _construct, 
    updateCharacterStats,
    updateCharacter,
} from './functions.js';

//These functions deal with adding, altering or removing professions from the character
//obj: The profession that is being parsed
function raceAdd(obj) {
    if (typeof obj === 'object') {
        var oRace = {
            id: parseInt(obj.details.id),
            modifier: null
        }
        if(obj.modifier.length>1) {
            console.log('choice should be made')
            oRace.modifier = parseInt($('input[name="stat-modifier"]:checked').val());
        } else {
            oRace.modifier = parseInt(obj.modifier[0].id);
        }
        oCharacter.race = oRace;
        updateCharacterStats();
        updateCharacter();
        $('#race').html(`<i class="fa-solid fa-rotate-right"></i>${obj.details.name}</span>`);   
        $('#selection-modal').foundation('close');     
    } else {
        console.error("professionAdd is not an object: " +$.type(obj));
    }
}

//This function will remove a profession to the character
//obj: The profession that is being parsed
function raceRemove() {
    oCharacter.race = {}
    updateCharacterStats();
    updateCharacter();
}

export {
    raceAdd,
    raceRemove,
}