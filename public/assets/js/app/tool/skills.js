//Generic settings and functions
import { domain, oCharacter, language, oTranslations } from './settings.js'
import { debugLog, showMessage } from './functions.js'
import { checkExperienceCost } from './experience.js';
import { openModal, updateModalDropdown } from './modal.js'
import { addToCharacter, removeFromCharacter, findItemIndex, addCharacterAsset, updateCharacterAsset } from './character.js';

// Define the class
class Skill {
    constructor({
        details: {
            id,
            name,
            modifier,
            xp_cost,
            allow_multiple
        },
        current: {
            sub_id = null,
            sub_name = null,
            rank,
            cost = 0
        } = {} // Provide a default empty object for destructuring
    }) {
        this.id = parseInt(id);
        this.name = name;
        this.sub_id = sub_id !== null ? parseInt(sub_id) : null;
        this.sub_name = sub_name !== null ? sub_name : null;;
        this.rank = parseInt(rank);
        this.cost = parseInt(cost);
        this.modifier = modifier[0].id !== undefined ? parseInt(modifier[0].id) : null;
        this.xp_cost = parseInt(xp_cost);
        this.allow_multiple = allow_multiple === 1;
        this.cost = parseInt(cost)
    }

    // Updated method to display all attributes
    displayInfo() {
        console.log(`ID: ${this.id}`);
        console.log(`Name: ${this.name}`);
        console.log(`Sub ID: ${this.sub_id}`);
        console.log(`Sub Name: ${this.sub_name}`);
        console.log(`Rank: ${this.rank}`);
        console.log(`Cost: ${this.cost}`);
        console.log(`Modifier: ${this.modifier}`);
        console.log(`XP Cost: ${this.xp_cost}`);
        console.log(`Allow Multiple: ${this.allow_multiple}`);
    }
}

/*
Logical progression for the user interactions explained:
//-1-- The action you invoke on the UX is that you pick a skill via one of the following functions
//-1a- You either pick a skill related to professions via: pickSkillProfession, which in turn calls the fuction: pickSkill
//-1b- You either pick a skill related to combat via: pickSkillCombat, which in turn calls the fuction: pickSkill
//-1c- You either pick a skill related to magic via: pickSkillMagic, which in turn calls the fuction: pickSkill
//-2-- Then you make choice from the options available to you by: chooseSkill
//-3-- After the choice is validated, it is then added to the character by: addSkill
//-4a- Once the skill is added to the character you can remove it again by: removeSkill
//-4b- If available you can also upgrade the level of your skill by: upgradeSkill
*/

// Page functions

function pickSkillProfession () {
    debugLog('pickSkillProfession');
    pickSkill('skill_base');
}
function pickSkillCombat () {
    debugLog('pickSkillCombat');
    pickSkill('skill_combat');
}
function pickSkillMagic () {
    debugLog('pickSkillMagic');
    pickSkill('skill_magic');
}

function pickSkill(sAction) {
    debugLog('pickSkill', sAction);
    
    // Define modal and form
    const $modal = $('#selection-modal');
    const $form = $('#modal-form');

    // Open the modal
    openModal(sAction,$modal);

    // Make AJAX call to fill the dropdown
    $.ajax({
        url: `${domain}/action/get-dropdown`,
        data: {
            action: `fill-dropdown-${sAction}`,
            character: oCharacter,
        },
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            debugLog('pickSkill[data]', data);
            const $select = $('select[name="type"]');            
            // Hide loading and show form and select
            $('div[data-id="modal-loading"]').hide();
            updateModalDropdown($select, data);
            $form.show();
            $select.show();
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });
}

/**
 * Choose a skill for the character.
 * @param {Object} obj - The skill object.
 */
function chooseSkill(obj) {
    debugLog('chooseSkill', obj);

    if (typeof obj !== 'object' || obj === null) {
        console.error("chooseSkill: 'obj' is not a valid object: " + $.type(obj));
        return;
    }

    //--Add the current attribute to the object
    const $subtype = $('input[name="subtype"]');
    obj.current = { 
        sub_id: $subtype.val() ? parseInt($subtype.val()) : null,
        sub_name: $subtype.text() ? $subtype.text() : null,
        rank: 1,
        cost: parseInt(obj.details.xp_cost)
    }

    const skillClass = new Skill(obj);

    // Check if the character has enough experience
    if (!checkExperienceCost(skillClass.xp_cost)) {
        showMessage('#choice-actions', 'error', oTranslations[language].not_enough_vp);
        return;
    }

    // Check for duplicates
    if (findItemIndex('skill', skillClass.id, skillClass.sub_id) !== -1) {
        showMessage('#choice-actions', 'error', oTranslations[language].duplicate_choose);
        return;
    }

    addSkill(skillClass);

}

/**
 * Add a skill to the character.
 * @param {Object} skill - The skill object.
 */
function addSkill(skill) {
    debugLog('addSkill', skill);

    //check if the skill is a valid object
    if (typeof skill !== 'object' || skill === null) {
        console.error("addSkill: 'obj' is not a valid object: " + $.type(obj));
        return;
    }

    addCharacterAsset('skill', skill);
    addToCharacter('skill', skill);
    $('#selection-modal').foundation('close');
}

/**
 * Remove a skill from the character.
 * @param {Object} skill - The skill object.
 */
function removeSkill(skill) {
    debugLog('removeSkill', skill);

    if (typeof skill !== 'object' || skill === null) {
        console.error("removeSkill: 'obj' is not a valid object: " + $.type(skill));
        return;
    }
    
    removeFromCharacter('skill', skill);
}

/**
 * Upgrade a skill linked to the character.
 * @param {Object} skill - The skill object.
 */
function upgradeSkill(skill) {
    debugLog('upgradeSkill', skill);

    //check if the skill is a valid object
    if (typeof skill !== 'object' || skill === null) {
        console.error("upgradeSkill: 'obj' is not a valid object: " + $.type(skill));
        return;
    }

    //attempt to find the proffesion within the character object
    const index = findItemIndex('skill', skill.id, skill.sub_id)
    if (index === -1) {
        console.error('Trying to upgrade skill, non-existent')
        return;
    }

    //get the new rank of the skill
    const new_rank = skill.rank+1;
    if (new_rank > 3) {
        showPopup(oTranslations[language].rank_max);
        return;
    }

    //get the new cost of the skill based on the new rank
    const new_cost = getRankCost(skill, new_rank);
    // Check if the character has enough experience
    if (!checkExperienceCost(new_cost)) {
        showPopup(oTranslations[language].not_enough_vp);
        return;
    }

    updateCharacterAsset('skill',skill,index,new_rank,new_cost);
}

export {  
    addSkill,
    chooseSkill,
    pickSkillProfession,
    pickSkillCombat,
    pickSkillMagic,
    removeSkill, 
    upgradeSkill,
}