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

function chooseSkill() {
    oTempData.rank = $('input[name="rank"]:checked').val() !== undefined ? parseInt($('input[name="rank"]:checked').val()) : null;
                oTempData.cost = calculateSkillCost(oTempData, oTempData.rank);
                handleChoice(oTempData,sAction,'skill');
}

//These functions deal with adding, altering or removing skills from the character
//obj: The skill that is being parsed
function addSkill(obj) {
    if (typeof obj === 'object') {
        characterAddTo(oCharacter.skills,'skill',obj)
    } else {
        console.error("skillAdd is not an object: " +$.type(obj));
    }
}

function pickSkillProfession () {

}
function pickSkillCombat () {
    
}
function pickSkillMagic () {
    
}

//This function will remove a skill from the character
//obj: The skill that is being parsed
function removeSkill(element,main_id,sub_id) {
    characterRemoveFrom(oCharacter.skills,element,'skill',main_id,sub_id)
}

export {  
    addSkill,
    chooseSkill,
    pickSkillProfession,
    pickSkillCombat,
    pickSkillMagic,
    removeSkill, 
}