//Generic settings and functions
import { oCharacter } from './settings.js'
import { debugLog } from './functions.js'
import { openSkillModal } from './modal.js'
//Functions needed for actual app performance
import { addToCharacter, removeFromCharacter } from './character.js';

function chooseSkill() {
    oTempData.rank = $('input[name="rank"]:checked').val() !== undefined ? parseInt($('input[name="rank"]:checked').val()) : null;
    oTempData.cost = calculateSkillCost(oTempData, oTempData.rank);
    handleChoice(oTempData,sAction,'skill');
}

//These functions deal with adding, altering or removing skills from the character
//obj: The skill that is being parsed
function addSkill(obj) {
    debugLog('addSkill', obj);
    if (typeof obj === 'object') {
        addToCharacter(oCharacter.skills,'skill',obj)
    } else {
        console.error("skillAdd is not an object: " +$.type(obj));
    }
}

function pickSkillProfession () {
    debugLog('pickSkillProfession');
    openSkillModal();
}
function pickSkillCombat () {
    debugLog('pickSkillCombat');
    openSkillModal();
}
function pickSkillMagic () {
    debugLog('pickSkillMagic');
    openSkillModal();
}

//This function will remove a skill from the character
//obj: The skill that is being parsed
function removeSkill(element,main_id,sub_id) {
    removeFromCharacter(oCharacter.skills,element,'skill',main_id,sub_id)
}

export {  
    addSkill,
    chooseSkill,
    pickSkillProfession,
    pickSkillCombat,
    pickSkillMagic,
    removeSkill, 
}