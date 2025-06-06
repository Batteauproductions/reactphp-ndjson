// Generic settings and functions
import { oCharacter } from '../../generator.js';
import { CharacterAsset } from './character_asset.js';
import { domain, oTranslations, language } from '../settings.js';
import { updateExperience } from '../experience.js';
import { debugLog } from '../functions.js';
import { openSelectionModal, updateModalDropdown, $subtypeSelect, $rankSelect } from '../modal/selection_modal.js';

// Define the class
class Profession extends CharacterAsset {
    constructor(params) {
        super(params);
        this.rank_1_cost = parseInt(params.current.rank_1_cost);
        this.rank_2_cost = parseInt(params.current.rank_2_cost);
        this.rank_3_cost = parseInt(params.current.rank_3_cost);
    }
    
    costSpend (cost = this.cost) {
        if(!updateExperience(cost,"spend")) {
            return oTranslations[language].not_enough_vp;  
        }
        return true;
    }

    costRefund(cost = this.cost) {
        if(!updateExperience(cost,"refund")) {
            return false;
        }
        return true;      
    }

    getNewRankCost(new_rank = null) {
        return this[`rank_${new_rank}_cost`];
    }

    getCurrentRankCost() {
        let total = 0;
        for (let i = 1; i <= this.rank; i++) {
            const cost = this[`rank_${i}_cost`] ?? 0;
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

    //--Add the current asset to the object
    obj.details = {
        ...obj.details,
        max_rank: 3,
        cost: parseInt(obj.details.rank_1_cost),
    }
    obj.current = { 
        sub_id: $subtypeSelect.find('option:selected').val() || null,
        sub_name: $subtypeSelect.find('option:selected').text() || null,
        rank: $rankSelect.val() || 1,
        container: sAction,
        attribute: 'profession',
        rank_1_cost: obj.details.rank_1_cost,
        rank_2_cost: obj.details.rank_2_cost,
        rank_3_cost: obj.details.rank_3_cost,
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