//Generic settings and functions
import { domain, oCharacter, language, oTranslations } from './settings.js'
import { debugLog, showMessage } from './functions.js'
import { checkCurrencyCost, convertCurrency } from './currency.js';
import { openSelectionModal, updateModalDropdown } from './modal.js'
import { addToCharacter, removeFromCharacter, findItemIndex, addCharacterAsset, updateCharacterAsset } from './character.js';

// Define the class
class Item {
    constructor({
        details: {
            id,
            name,
            price,
        },
        modifier = [], // Default to an empty array for safety
        current: {
            amount,
            cost = 0
        } = {} // Provide a default empty object for destructuring
    }) {
        this.id = parseInt(id);
        this.name = name;
        this.price = parseInt(price);
        this.modifier = modifier.length > 0 && modifier[0]?.id !== undefined ? parseInt(modifier[0].id) : null;
        this.amount = parseInt(amount);
        this.cost = this.price * this.amount;
    }

    costText() {
        return convertCurrency(this.cost);
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

    add() {

        // Check if the character has enough experience
        if (!checkCurrencyCost(this.cost)) {
            showMessage('#choice-actions', 'error', oTranslations[language].not_enough_coin);
            return;
        }

        // Check for duplicates
        if (findItemIndex('item', this.id) !== -1) {
            showMessage('#choice-actions', 'error', oTranslations[language].duplicate_choose);
            return;
        }
        
        addCharacterAsset('item', this);
        addToCharacter('item', this);
        $('#selection-modal').foundation('close');
    }

    remove() {
        removeFromCharacter('item', this);
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

function chooseItem (obj) {
    debugLog('chooseItem', obj);

    // Validate that the input is a valid object
    if (typeof obj !== 'object' || obj === null) {
        console.error("chooseItem: 'obj' is not a valid object: " + $.type(obj));
        return;
    }

    // Add the current attribute to the object
    obj.current = { 
        amount: $('input[name="amount"]').val(),
    };
    
    const itemClass = new Item(obj);

    if(itemClass.add()) {
        $('#selection-modal').foundation('close');
    }
}

/**
 * Upgrade a profession linked to the character.
 * @param {Object} item - The profession object.
 */
function adjustItemAmount(item,adjustment) {
    debugLog('adjustItemAmount', item);

    //check if the profession is a valid object
    if (typeof item !== 'object' || item === null) {
        console.error("adjustItemAmount: 'obj' is not a valid object: " + $.type(item));
        return;
    }

    //attempt to find the proffesion within the character object
    const index = findItemIndex('item', item.id)
    if (index === -1) {
        console.error('Trying to adjust item amount, non-existent')
        return;
    }

    //get the new cost of the profession based on the new rank
    const new_cost = getRankCost(profession, new_rank);
    // Check if the character has enough experience
    if (!checkExperienceCost(new_cost)) {
        showPopup(oTranslations[language].not_enough_vp);
        return;
    }

    updateCharacterAsset('profession',profession,index,new_rank,new_cost);
}


function pickBasekit () {
    debugLog('pickBasekit');
}

function chooseBasekit(obj) {
    debugLog('chooseBasekit', obj);
    let $element = $('div[data-id="base_kit-list"]');
    oCharacter.build.base_kit = parseInt(oTempData.details.id);
    let container = $('<div>', {
        html: `<h3 data-title>${oTempData.details.name}</h3><p data-description>${oTempData.details.description}</p>`
    });
    let icon = icons["change"];
    $('a[data-type="base_kit"]').html(`${icon.icon} ${icon.text}`);
    $element.empty().append(container);
    updateCharacter();
    $('#selection-modal').foundation('close');
}

export {
    pickItem,
    chooseItem,
    adjustItemAmount,
    pickBasekit,
    chooseBasekit,
}