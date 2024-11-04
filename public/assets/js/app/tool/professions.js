// Importing the variables
import { 
    oCharacter    
} from './settings.js';

// Importing the functions needed for the file
import { 
    debugLog,
    characterAddTo,
    handleChoice,
} from './functions.js';

import {
    openProfessionModal
} from './modal.js'

//These functions deal with adding, altering or removing professions from the character
//obj: The profession that is being parsed
function addProfession(obj) {
    debugLog('professionAdd');
    if (typeof obj === 'object') {
        characterAddTo(oCharacter.profession,'profession',obj)
    } else {
        console.error("professionAdd is not an object: " +$.type(obj));
    }
}

//Called when a user attemps to choose a profession
function chooseProfession(obj) {
    debugLog('professionChoose');
    if (typeof obj === 'object') {
        obj.rank = 1;
        obj.cost = calculateProfessionCost(obj, obj.rank);
        if (handleChoice(obj,'profession')) {
            addProfession(obj);
        }
    } else {
        console.error("professionAdd is not an object: " +$.type(obj));
    }
}

function pickProfession() {
    debugLog('pickProfession');
    openProfessionModal();
}

//This function will remove a profession to the character
//obj: The profession that is being parsed
function removeProfession(main_id,sub_id) {
    debugLog('professionRemove');

    //characterRemoveFrom(oCharacter.profession,element,'profession',main_id,sub_id)
}

function upgradeProfession(main_id,sub_id) {
    debugLog('professionAdd');
}

export {
    pickProfession,
    addProfession,
    chooseProfession,
    upgradeProfession,
    removeProfession,
}