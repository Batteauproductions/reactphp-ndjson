//Generic settings and functions
import { oCharacter } from '../generator.js';
import { domain, iconset, language, oTranslations } from './settings.js'
import { debugLog, generateIconSet, showMessage, showPopup } from './functions.js'
import { checkExperienceCost } from './experience.js';
import { openSelectionModal, updateModalDropdown, $subtypeSelect, $rankSelect } from './modal/selection_modal.js';
import { findItemIndex } from './character.js';

// Define the class
class Skill {
    constructor({
        details: {
            id,
            name,
            xp_cost,
            max_rank,
            allow_multiple
        },
        modifier = [], // Default to an empty array for safety
        current: {
            sub_id = null,
            sub_name = null,
            rank = null,
            cost = 0,
            racial = false,
            container = 'skill_base'
        } = {} // Provide a default empty object for destructuring
    }) {
        this.id = parseInt(id);
        this.name = name;
        this.sub_id = sub_id !== null ? parseInt(sub_id) : null;
        this.sub_name = sub_name !== null ? sub_name : null;
        this.rank = parseInt(rank);
        this.max_rank = !isNaN(parseInt(max_rank)) ? parseInt(max_rank) : 1;
        this.modifier = modifier.length > 0 && modifier[0]?.id !== undefined ? parseInt(modifier[0].id) : null;
        this.xp_cost = parseInt(xp_cost);
        this.allow_multiple = allow_multiple === 1;
        this.racial = racial; // a skill can be added as part as a racial bonus
        this.cost = this.racial ? 0 : parseInt(cost); // all racial skills are 0 cost      
        this.container = container;
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

    add () {
        // Check if the character has enough experience
        if (!checkExperienceCost(this.cost, this.xp_cost)) {
            showMessage('#choice-actions', 'error', oTranslations[language].not_enough_vp);
            return;
        }

        // Check for duplicates
        if (findItemIndex('skill', this.id, this.sub_id) !== -1) {
            showMessage('#choice-actions', 'error', oTranslations[language].duplicate_choose);
            return;
        }

        oCharacter.addAsset('skill', this);
        oCharacter.addAssetToSheet('skill', this);
        
        return true;
    }

    remove () {
        oCharacter.removeAsset('skill', this);
        return true;
    }

    upgrade () {
        //attempt to find the proffesion within the character object
        const index = findItemIndex('skill', this.id, this.sub_id)
        if (index === -1) {
            console.error('Trying to upgrade skill, non-existent')
            return;
        }

        //get the new rank of the skill
        const new_rank = this.rank+1;
        let new_icons = null;
        if (new_rank > this.max_rank) {
            showPopup(oTranslations[language].rank_max);
            new_icons = generateIconSet(iconset["attribute_adjust_down"],this,'skill');
            return;
        } else if (new_rank == this.max_rank) {
            new_icons = generateIconSet(iconset["attribute_adjust_down"],this,'skill');
        } else if (new_rank == this.min_rank) {
            new_icons = generateIconSet(iconset["attribute_adjust_up"],this,'skill');
        } else if (new_rank < this.max_rank) {
            new_icons = generateIconSet(iconset["attribute_adjust_all"],this,'skill');
        }

        //get the new cost of the skill based on the new rank
        const old_cost = this.cost;
        const new_cost = this.getRankCost(new_rank);
        // Check if the character has enough experience
        if (!checkExperienceCost(old_cost, new_cost)) {
            showPopup(oTranslations[language].not_enough_vp);
            return;
        }

        oCharacter.updateAsset('skill',index,new_rank,new_cost,new_icons);
        return true;
    }

    downgrade() {
        //attempt to find the proffesion within the character object
        const index = findItemIndex('skill', this.id, this.sub_id)
        if (index === -1) {
            console.error('Trying to upgrade skill, non-existent')
            return;
        }

        //get the new rank of the profession
        const new_rank = this.rank-1;
        let new_icons = null;
        if (new_rank < 1) {
            showPopup(oTranslations[language].rank_min);
            new_icons = generateIconSet(iconset["attribute_adjust_up"],this,'skill');
            return;
        } else if (new_rank == 1) {
            new_icons = generateIconSet(iconset["attribute_adjust_up"],this,'skill');
        } else if (new_rank > 1) {
            new_icons = generateIconSet(iconset["attribute_adjust_all"],this,'skill');
        } 

        //get the new cost of the skill based on the new rank
        const new_cost = this.getRankCost(new_rank);
        
        oCharacter.updateAsset('skill',index,new_rank,new_cost,new_icons);
        return true;
    }

    getRankCost(new_rank) {
        return this.xp_cost * new_rank;
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
function chooseSkill(sAction, obj) {
    debugLog('chooseSkill', obj);

    if (typeof obj !== 'object' || obj === null) {
        console.error("chooseSkill: 'obj' is not a valid object: " + $.type(obj));
        return;
    }

    //--Add the current attribute to the object
    obj.current = { 
        sub_id: $subtypeSelect.find('option:selected').val() || null,
        sub_name: $subtypeSelect.find('option:selected').text() || null,
        rank: $rankSelect.val() || 1,
        cost: parseInt(obj.details.xp_cost),
        container: sAction
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
    chooseSkill,    
}