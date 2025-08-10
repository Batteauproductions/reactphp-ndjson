//Generic settings and functions
import { CharacterAsset } from './character_asset.js';
import { domain } from '../../_lib/settings.js';
import { debugLog } from '../../_lib/functions.js';
import { convertCurrency, updateCurrency} from '../helper/currency.js';
import { openSelectionModal, updateModalDropdown } from '../modal/selection_modal.js';

// Define the class
class Item extends CharacterAsset {
    constructor(params) {
        super(params);
    }

    costText() {
        return convertCurrency(this.asset_value_cost);
    }

    costSpend (cost) {
        return updateCurrency(cost,"spend");
    }

    costRefund(cost) {
        return updateCurrency(cost,"refund")
    }

}

/*
Logical progression for the user interactions explained:
//-1-- The action you invoke on the UX is that you pick a item via the function: pickItem
//-2-- Then you make choice from the options available to you by: chooseItem
//-3-- After the choice is validated, it is then added to the character by: addProfession
//-4a- Once the profession is added to the character you can remove it again by: removeItem
//-4b- If available you can also upgrade the level of your profession by: upgradeProfession 
*/

// Page functions

/**
 * Pick a Item from a modal.
 */
function pickItem () {
    debugLog('pickItem');

    const $modal = $('#selection-modal');
    const $form = $('#modal-form');
    const sAction = 'item';

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
            debugLog('pickItem[data]', data);
            const $select = $('select[name="type"]');
            $('div[data-id="modal-loading"]').hide();
            updateModalDropdown($select, data);
            $form.show();
        },
        error: function(error) {
            console.error('pickItem: Error fetching data:', error);
        }
    });
}

function chooseItem (sAction, obj) {
    debugLog('chooseItem', obj);

    // Validate that the input is a valid object
    if (typeof obj !== 'object' || obj === null) {
        console.error("chooseItem: 'obj' is not a valid object: " + $.type(obj));
        return;
    }

    // Update details and current in one go
    obj.details = {
        ...obj.details,
    };

    obj.current = {
        asset_value: 1,
        container: sAction,
        attribute: 'item',
    };

    const itemClass = new Item(obj);

    if(itemClass.add()) {
        $('#selection-modal').foundation('close');
    }
} 

export { 
    Item,
    pickItem,
    chooseItem,
}