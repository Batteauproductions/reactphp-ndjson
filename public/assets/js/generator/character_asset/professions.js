// Generic settings and functions
import { CharacterAsset } from './character_asset.js';
import { domain, oTranslations, language } from '../../_lib/settings.js';
import { updateExperience } from '../helper/experience.js';
import { debugLog } from '../../_lib/functions.js';
import { openSelectionModal, updateModalDropdown, $subtypeSelect, $rankSelect } from '../modal/selection_modal.js';

// Define the class
class Profession extends CharacterAsset {
    constructor(params) {
        super(params);
    }
    
    costSpend (cost = this.rank_cost) {
        if(!updateExperience(cost,"spend")) {
            return oTranslations[language].not_enough_vp;  
        }
        return true;
    }

    costRefund(cost = this.rank_cost) {
        if(!updateExperience(cost,"refund")) {
            return false;
        }
        return true;      
    }

    getNewRankCost(new_rank = null) {
        const arr_cost = this.cost.split('|');
        return parseInt(arr_cost[new_rank-1]);
    }

    getCurrentRankCost() {
        let total = 0;
        const arr_cost = this.cost.split('|'); 
        for (let i = 0; i <= (this.rank-1); i++) {
            const cost = parseInt(arr_cost[i]) ?? 0;
            total += cost;
        }
        return total;
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
            character: window.character,
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
    
    //--Add the current asset to the object
    obj.details = {
        ...obj.details,
        max_rank: 3,
    }

    //convert cost to array
    const str_cost = obj.details.cost;
    const arr_cost = str_cost.split('|');

    obj.current = { 
        sub_id: $subtypeSelect.find('option:selected').val() || null,
        sub_name: $subtypeSelect.find('option:selected').text() || null,
        rank: $rankSelect.val() || 1,
        container: sAction,
        attribute: 'profession',
        rank_cost: parseInt(arr_cost[0]),
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