//Generic settings and functions
import { CharacterAsset } from './character_asset.js';
import { domain, oTranslations, language } from '../../_lib/settings.js';
import { debugLog, showPopup } from '../../_lib/functions.js';
import { openSelectionModal, updateModalDropdown, $subtypeSelect, $rankSelect } from '../modal/selection_modal.js';

// Define the class
class Skill extends CharacterAsset {
    constructor(params) {
        super(params);
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
function pickSkillDivine () {
    debugLog('pickSkillDivine');
    pickSkill('skill_divine');
}

/**
 * Handles the process of selecting a skill by opening a modal, fetching dropdown data via AJAX, 
 * and populating the modal form with the fetched data.
 * @param {string} sAction - The action type, used to determine the context for the skill selection.
 */
function pickSkill(sAction) {
    debugLog('pickSkill', sAction);
    
    // Define modal and form
    const $modal = $('#selection-modal');
    const $form = $('#modal-form');

    // Open the modal
    openSelectionModal(sAction,$modal);

    // Make AJAX call to fill the dropdown
    $.ajax({
        url: `${domain}/action/get-dropdown`,
        data: {
            action: `fill-dropdown-${sAction}`,
            character: window.character,
        },
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            debugLog('pickSkill[data]', data);
            if(data.length > 0) {
                const $select = $('select[name="type"]');            
                // Hide loading and show form and select
                $('div[data-id="modal-loading"]').hide();
                updateModalDropdown($select, data);
                $form.show();
            } else {
                showPopup(`<p>${oTranslations[language].no_skills_available}</p>`,'inform','question');
            }
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
function chooseSkill(sAction, obj) {
    debugLog('chooseSkill', obj);

    if (typeof obj !== 'object' || obj === null) {
        console.error("chooseSkill: 'obj' is not a valid object: " + $.type(obj));
        return;
    }

    //--Add the current asset to the object
    obj.details = {
        ...obj.details,
    }
    obj.current = {
        sub_id: $subtypeSelect.find('option:selected').val() || null,
        sub_name: $subtypeSelect.find('option:selected').text() || null,
        rank: $rankSelect.val() || 1,        
        container: sAction,
        attribute: 'skill',
    }

    const skillClass = new Skill(obj);

    if(skillClass.add()) {
        $('#selection-modal').foundation('close');
    } 

}

export {  
    Skill,
    pickSkillProfession,
    pickSkillCombat,
    pickSkillMagic,
    pickSkillDivine,
    chooseSkill,    
}