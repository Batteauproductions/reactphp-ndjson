// Generic settings and functions
import { oCharacter } from '../generator.js';
import { domain, iconset, language, oTranslations } from './settings.js';
import { debugLog, generateIconSet, showMessage, showPopup } from './functions.js';
import { checkExperienceCost } from './experience.js';
import { openSelectionModal, updateModalDropdown, $subtypeSelect, $rankSelect } from './modal/selection_modal.js';
import { findItemIndex } from './character.js';

// Define the class
class Profession {
    constructor({
        details: {
            id,
            name,
            rank_1_cost,
            rank_2_cost,
            rank_3_cost,
            allow_multiple
        },
        modifier = [], // Default to an empty array for safety
        current: {
            sub_id = null,
            sub_name = null,
            rank,
            cost = 0,
            container = 'profession',
            created_dt = null,
            modified_dt = null,
        } = {} // Provide a default empty object for destructuring
    }) {
        this.id = parseInt(id);
        this.name = name;
        this.sub_id = sub_id !== null ? parseInt(sub_id) : null;
        this.sub_name = sub_name;
        this.rank = rank !== undefined ? parseInt(rank) : null;
        this.max_rank = 3;
        this.cost = parseInt(cost);
        this.modifier = modifier.length > 0 && modifier[0]?.id !== undefined ? parseInt(modifier[0].id) : null;
        this.rank_1_cost = parseInt(rank_1_cost);
        this.rank_2_cost = parseInt(rank_2_cost);
        this.rank_3_cost = parseInt(rank_3_cost);
        this.allow_multiple = allow_multiple === 1;
        this.container = container;
        this.created_dt = created_dt;
        this.modified_dt = modified_dt;
    }

    // Method to display all attributes
    displayInfo() {
        console.log(`ID: ${this.id}`);
        console.log(`Name: ${this.name}`);
        console.log(`Sub ID: ${this.sub_id}`);
        console.log(`Sub Name: ${this.sub_name}`);
        console.log(`Rank: ${this.rank}`);
        console.log(`Cost: ${this.cost}`);
        console.log(`Modifier: ${this.modifier}`);
        console.log(`Rank 1 Cost: ${this.rank_1_cost}`);
        console.log(`Rank 2 Cost: ${this.rank_2_cost}`);
        console.log(`Rank 3 Cost: ${this.rank_3_cost}`);
        console.log(`Allow Multiple: ${this.allow_multiple}`);
    }

    add() {
        // Check if the character has enough experience
        if (!checkExperienceCost(this.cost, this.rank_1_cost)) {
            showMessage('#choice-actions', 'error', oTranslations[language].not_enough_vp);
            return false;
        }

        // Check for duplicates
        if (findItemIndex('profession', this.id, this.sub_id) !== -1) {
            showMessage('#choice-actions', 'error', oTranslations[language].duplicate_choose);
            return false;
        }

        oCharacter.addAsset('profession', this);
        oCharacter.addAssetToSheet('profession', this);

        return true;
    }
    
    remove() {
        oCharacter.removeAsset('profession', this);
        return true;
    }

    upgrade() {
        //attempt to find the proffesion within the character object
        const index = findItemIndex('profession', this.id, this.sub_id)
        if (index === -1) {
            console.error('Trying to upgrade profession, non-existent')
            return;
        }

        //get the new rank of the profession
        const new_rank = this.rank+1;
        let new_icons = null;
        if (new_rank > this.max_rank) {
            showPopup(oTranslations[language].rank_max);
            new_icons = generateIconSet(iconset["attribute_adjust_down"],this,'profession');
            return;
        } else if (new_rank == this.max_rank) {
            new_icons = generateIconSet(iconset["attribute_adjust_down"],this,'profession');
        } else if (new_rank == this.min_rank) {
            new_icons = generateIconSet(iconset["attribute_adjust_up"],this,'profession');
        } else if (new_rank < this.max_rank) {
            new_icons = generateIconSet(iconset["attribute_adjust_all"],this,'profession');
        } 

        //get the new cost of the profession based on the new rank
        const old_cost = this.cost;
        const new_cost = this.getRankCost(new_rank);
        // Check if the character has enough experience
        if (!checkExperienceCost(old_cost, new_cost)) {
            showPopup(oTranslations[language].not_enough_vp);
            return;
        }

        oCharacter.updateAsset('profession',index,new_rank,new_cost,new_icons);
        return true;
    }

    downgrade() {
        //attempt to find the proffesion within the character object
        const index = findItemIndex('profession', this.id, this.sub_id)
        if (index === -1) {
            console.error('Trying to downgrade profession, non-existent')
            return;
        }

        //get the new rank of the profession
        const new_rank = this.rank-1;
        let new_icons = null;
        if (new_rank < 1) {
            showPopup(oTranslations[language].rank_min);
            new_icons = generateIconSet(iconset["attribute_adjust_up"],this,'profession');
            return;
        } else if (new_rank == 1) {
            new_icons = generateIconSet(iconset["attribute_adjust_up"],this,'profession');
        } else if (new_rank > 1) {
            new_icons = generateIconSet(iconset["attribute_adjust_all"],this,'profession');
        } 

        //get the new cost of the profession based on the new rank
        const new_cost = this.getRankCost(new_rank);
        oCharacter.updateAsset('profession',index,new_rank,new_cost,new_icons);
        return true;
    }

    getRankCost(new_rank) {
        let totalCost = 0;
        for (let i = 1; i <= new_rank; i++) {
            const propertyName = `rank_${i}_cost`;
            if (this[propertyName] !== undefined) {
                totalCost += this[propertyName];
            }
        }
        return totalCost;
    }
}

/*
Logical progression for the user interactions explained:
//-1-- The action you invoke on the UX is that you pick a profession via the function: pickProfession
//-2-- Then you make choice from the options available to you by: chooseProfession
//-3-- After the choice is validated, it is then added to the character by: addProfession
//-4a- Once the profession is added to the character you can remove it again by: removeProfession
//-4b- If available you can also upgrade the level of your profession by: upgradeProfession 
*/

// Page functions

/**
 * Pick a profession from a modal.
 */
function pickProfession() {
    debugLog('pickProfession');

    const $modal = $('#selection-modal');
    const $form = $('#modal-form');
    const sAction = 'profession';

    openSelectionModal(sAction, $modal);

    $.ajax({
        url: `${domain}/action/get-dropdown`,
        type: 'POST',
        dataType: 'json',
        data: {
            action: `fill-dropdown-${sAction}`,
            character: oCharacter,
        },
        success: function(data) {
            debugLog('pickProfession[data]', data);
            const $select = $('select[name="type"]');
            $('div[data-id="modal-loading"]').hide();
            updateModalDropdown($select, data);
            $form.show();
            $select.show();
        },
        error: function(error) {
            console.error('pickProfession: Error fetching data:', error);
        }
    });
}

/**
 * Choose a profession for the character.
 * @param {Object} obj - The profession object.
 */
function chooseProfession(sAction, obj) {
    debugLog('professionChoose', obj);

    // Validate that the input is a valid object
    if (typeof obj !== 'object' || obj === null) {
        console.error("chooseProfession: 'obj' is not a valid object: " + $.type(obj));
        return;
    }

    // Add the current attribute to the object
    obj.current = { 
        sub_id: $subtypeSelect.find('option:selected').val() || null,
        sub_name: $subtypeSelect.find('option:selected').text() || null,
        rank: $rankSelect.val() || 1,
        cost: obj.details.rank_1_cost,
        container: sAction,
    };
    
    const profClass = new Profession(obj);

    if(profClass.add()) {
        $('#selection-modal').foundation('close');
    }
}

// Export functions
export {
    Profession,
    pickProfession,
    chooseProfession,
}