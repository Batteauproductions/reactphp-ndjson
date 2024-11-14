// Generic settings and functions
import { domain, oCharacter, language, oTranslations } from './settings.js';
import { debugLog, showMessage, addCharacterAsset } from './functions.js';
import { checkExperienceCost } from './experience.js';
import { openModal, updateModalDropdown } from './modal.js';
import { addToCharacter, updateCharacterStats, updateCharacter, removeFromCharacter, findItemIndex } from './character.js';

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
        modifier = [], // Default to an empty object for safety
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
        this.sub_name = sub_name;
        this.rank = rank !== undefined ? parseInt(rank) : null;
        this.cost = parseInt(cost);
        this.modifier = modifier[0].id !== undefined ? parseInt(modifier[0].id) : null;
        this.rank_1_cost = parseInt(rank_1_cost);
        this.rank_2_cost = parseInt(rank_2_cost);
        this.rank_3_cost = parseInt(rank_3_cost);
        this.allow_multiple = allow_multiple === 1;
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

    openModal(sAction, $modal);

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
function chooseProfession(obj) {
    debugLog('professionChoose', obj);

    // Validate that the input is a valid object
    if (typeof obj !== 'object' || obj === null) {
        console.error("chooseProfession: 'obj' is not a valid object: " + $.type(obj));
        return;
    }

    // Add the current attribute to the object
    const $subtype = $('select[name="subtype"]');
    obj.current = { 
        sub_id: $subtype.val() || null,
        sub_name: $subtype.find('option:selected').text() || null,
        rank: 1,
        cost: obj.details.rank_1_cost
    };
    
    const profClass = new Profession(obj);

    // Check if the character has enough experience
    if (!checkExperienceCost(profClass.rank_1_cost)) {
        showMessage('#choice-actions', 'error', oTranslations[language].not_enough_vp);
        return;
    }

    // Check for duplicates
    if (findItemIndex(oCharacter.profession, profClass.id, profClass.sub_id) !== -1) {
        showMessage('#choice-actions', 'error', oTranslations[language].duplicate_choose);
        return;
    }

    // Add the profession to the character
    addProfession(profClass);
}

/**
 * Add a profession to the character.
 * @param {Object} profession - The profession object.
 */
function addProfession(profession) {
    debugLog('professionAdd', profession);

    //check if the profession is a valid object
    if (typeof profession !== 'object' || profession === null) {
        console.error("removeProfession: 'obj' is not a valid object: " + $.type(profession));
        return;
    }
    
    addCharacterAsset('profession', profession);
    addToCharacter('profession', profession, oCharacter.profession);
    $('#selection-modal').foundation('close');
}

/**
 * Remove a profession from the character.
 * @param {Object} profession - The profession object.
 */
function removeProfession(profession) {
    debugLog('professionRemove', profession);
    
    //check if the profession is a valid object
    if (typeof profession !== 'object' || profession === null) {
        console.error("removeProfession: 'obj' is not a valid object: " + $.type(profession));
        return;
    }
    
    removeFromCharacter('profession', profession, oCharacter.profession);
}

/**
 * Upgrade a profession linked to the character.
 * @param {Object} profession - The profession object.
 */
function upgradeProfession(profession) {
    debugLog('professionUpgrade', profession);

    //check if the profession is a valid object
    if (typeof profession !== 'object' || profession === null) {
        console.error("upgradeProfession: 'obj' is not a valid object: " + $.type(profession));
        return;
    }

    //attempt to find the proffesion within the character object
    const index = findItemIndex(oCharacter.profession, profession.id, profession.sub_id)
    if (index !== -1) {
        console.error('Trying to upgrade profession, non-existent')
        return;
    }

    //get the new rank of the profession
    const new_rank = profession.rank++;
    if (new_rank > 3) {
        showMessage('#choice-actions', 'error', oTranslations[language].not_enough_vp);
        return;
    }

    //get the new cost of the profession based on the new rank
    const new_cost = getRankCost(profession, new_rank);
    // Check if the character has enough experience
    if (!checkExperienceCost(new_cost)) {
        showMessage('#choice-actions', 'error', oTranslations[language].not_enough_vp);
        return;
    }

    //Update the character object
    oCharacter.profession[index].rank = new_rank;
    oCharacter.profession[index].cost = new_cost;

    // Update the stats if there was a modifier present
    if (profession.modifier) {
        updateCharacterStats();
    }
    // Update the character object in the interface
    updateCharacter();
}

/**
 * Calculates the cumulative rank cost up to a specified rank.
 * @param {Object} profession - The object containing rank cost properties.
 * @param {number} rank - The rank up to which the costs should be summed.
 * @returns {number} The total cumulative cost for ranks from 1 up to the specified rank.
 */
function getRankCost(profession, rank) {
    let totalCost = 0;
    for (let i = 1; i <= rank; i++) {
        const propertyName = `rank_${i}_cost`;
        if (profession[propertyName] !== undefined) {
            totalCost += profession[propertyName];
        }
    }
    return totalCost;
}

// Export functions
export {
    pickProfession,
    chooseProfession,
    addProfession,     
    removeProfession,
    upgradeProfession,
}