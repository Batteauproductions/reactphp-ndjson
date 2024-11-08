//Generic settings and functions
import { domain, oCharacter, language, oTranslations } from './settings.js'
import { debugLog, checkXPCost, showMessage } from './functions.js'
import { openModal } from './modal.js'
//Functions needed for actual app performance
import { addToCharacter, removeFromCharacter } from './character.js';
import { addSkill } from './skills.js';

function pickRace() {

}

//These functions deal with adding, altering or removing professions from the character
//obj: The profession that is being parsed
function addRace(obj) {
    if (typeof obj === 'object') {
        //before you add, remove the existing race and everything associated with it
        raceRemove(obj);

        //declare a new usable race variable
        const oRace = {
            id: parseInt(obj.details.id),
            modifier: null
        }
        //determine race modifier
        if (obj.modifier && obj.modifier.length > 0) {
            oRace.modifier = parseInt(obj.modifier.length > 1 ? $('input[name="stat-modifier"]:checked').val() : obj.modifier[0].id);
        }
        //add racial skills
        if (choice_skills.length > 0) {
            addSkill(choice_skills[i]);
            elementAdd("skill_base-list", choice_skills[i], "skill");
            choice_skills.length = 0;
        }          
        // Assign race to character
        oCharacter.race = oRace;
        updateCharacterStats();
        updateCharacter();
        //allow race to be rechosen
        $('#race').html(`<i class="fa-solid fa-rotate-right"></i>${obj.details.name}</span>`);   
        $('#selection-modal').foundation('close');     
    } else {
        console.error("raceAdd is not an object: " +$.type(obj));
    }
}

//This function will remove a race from the character
//obj: The race that is being parsed
function removeRace(obj) {
    oCharacter.race = {}
    // Check if the skill attribute exists in race and equals true, then remove it
    oCharacter.skills.forEach(skill => {
        const { main_id, sub_id } = skill;
        characterRemoveFrom(oCharacter.skills,'skill_base-list','skill',main_id,sub_id)
    });
    oCharacter.skills = oCharacter.skills.filter(skill => {
        return !(race.skills && race.skills[skill.main_id] === true);
    });
    
    updateCharacterStats();
    updateCharacter();
}

export {
    addRace,
    pickRace,
    removeRace,
}