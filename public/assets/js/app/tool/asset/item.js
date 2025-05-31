//Generic settings and functions
import { oCharacter } from '../../generator.js';
import { CharacterAsset } from './character_asset.js';
import { domain, oTranslations, language } from '../settings.js';
import { debugLog } from '../functions.js';
import { convertCurrency, updateCurrency} from '../currency.js';
import { openSelectionModal, updateModalDropdown } from '../modal/selection_modal.js';

// Define the class
class Item extends CharacterAsset {
    constructor(params) {
        super(params);
        // Ensure `amount` is a number inside `current`
        this.amount = parseInt(params.current.amount);
        this.price = parseInt(params.details.price);
        this.price_high = parseInt(params.details.price_high);
        this.price_low = parseInt(params.details.price_low);
    }


    // Updated method to display all attributes
    displayInfo() {
        console.log(`ID: ${this.id}`);
        console.log(`Name: ${this.name}`);
        console.log(`Price: ${this.price}`);
        console.log(`Modifier: ${this.modifier}`);
        console.log(`Amount: ${this.amount}`);
        console.log(`Cost: ${this.cost}`);
    }

    costText() {
        return convertCurrency(this.cost);
    }

    costSpend (cost = this.cost) {
        if(!updateCurrency(cost,"spend")) {
            return oTranslations[language].not_enough_coin;  
        }
        return true;
    }

    costRefund(cost = this.cost) {
        if(!updateCurrency(cost,"refund")) {
            return false;
        }
        return true;      
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
            character: oCharacter,
        },
        success: function(data) {
            debugLog('pickItem[data]', data);
            const $select = $('select[name="type"]');
            $('div[data-id="modal-loading"]').hide();
            updateModalDropdown($select, data);
            $form.show();
            $select.show();
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

    
    const amount = parseInt($('input[name="amount"]').val()) || 0;
    const itemcost = parseInt(obj.details?.price) || 0;

    // Update details and current in one go
    obj.details = {
        ...obj.details,
        cost: amount * itemcost,
    };

    obj.current = {
        amount,
        container: sAction,
        attribute: sAction,
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