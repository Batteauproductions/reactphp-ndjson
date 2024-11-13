//Generic settings and functions
import { domain, oCharacter, language, oTranslations } from './settings.js'
import { debugLog, showMessage, addElement } from './functions.js'
import { checkExperienceCost } from './experience.js';
import { openModal, updateModalDropdown } from './modal.js'
import { addToCharacter, removeFromCharacter, findItemIndex } from './character.js';

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
    debugLog('pickSkill');
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

    //--Nested destructuring of the Object
    const { details: { id, xp_cost }, current: { sub_id } } = obj;

    if (!checkExperienceCost(xp_cost)) {
        showMessage('#choice-actions', 'error', oTranslations[language].not_enough_vp);
        return;
    }

    if (findItemIndex(oCharacter.profession, id, sub_id) !== -1) {
        showMessage('#choice-actions', 'error', oTranslations[language].duplicate_choose);
        return;
    }

    addSkill(obj);

}

/**
 * Add a skill to the character.
 * @param {Object} obj - The skill object.
 */
function addSkill(obj) {
    if (typeof obj !== 'object' || obj === null) {
        console.error("addSkill: 'obj' is not a valid object: " + $.type(obj));
        return;
    }

    addElement('skill', obj);
    addToCharacter(oCharacter.skills, 'skill', obj);
    $('#selection-modal').foundation('close');
}

/**
 * Remove a skill from the character.
 * @param {Object} obj - The skill object.
 */
function removeSkill(obj) {
    if (typeof obj !== 'object' || obj === null) {
        console.error("removeSkill: 'obj' is not a valid object: " + $.type(obj));
        return;
    }

    debugLog('removeSkill', obj);
    removeFromCharacter('skill', obj, oCharacter.skills);
}

/**
 * Upgrade a skill linked to the character.
 * @param {Object} obj - The skill object.
 */
function upgradeSkill(obj) {
    if (typeof obj !== 'object' || obj === null) {
        console.error("upgradeSkill: 'obj' is not a valid object: " + $.type(obj));
    }

    debugLog('upgradeSkill', obj);
    //-- Needs implementation
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