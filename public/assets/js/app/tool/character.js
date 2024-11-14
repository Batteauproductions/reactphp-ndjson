// Generic settings and functions
import { domain, icons, oCharacter, jsonBaseChar, jsonStat } from './settings.js';
import { debugLog } from './functions.js';
import { spendCurrency, convertCurrency, refundCurrency } from './currency.js';
import { spendExperience, refundExperience } from './experience.js';

// Page functions

/**
 * Add elements to the character.
 * @param {string} sAction - The type of element being added (profession, skill, item).
 * @param {Object} characterAsset - The object representing the element being added.
 */
function addToCharacter(sAction, characterAsset) {
    debugLog('addToCharacter');

    if (typeof characterAsset !== 'object' || characterAsset === null) {
        console.error("addToCharacter: 'characterAsset' is not a valid object: " + $.type(characterAsset));
        return;
    }

    // Add the characterAsset to the specified attribute
    oCharacter[sAction].push(characterAsset);

    // Spend experience or currency based on the type
    if (sAction === "profession" || sAction === "skill") {
        spendExperience(characterAsset.cost);
    } else if (sAction === "item") {
        spendCurrency(characterAsset.cost);
    }

    // Update character stats if the subject has a modifier
    if (characterAsset.modifier) {
        updateCharacterStats();
    }

    // Update the visual part of the character sheet
    updateCharacter();
}

function calculateIncrease(id) {
    let increase = 0;
    // Helper function to calculate the increase for each category
    var calculateForCategory = (category) => {
        if ($.isArray(category)) {
            $.each(category, function(key, value) {
                if (value.modifier == id) {
                    increase += value.rank > 1 ? value.rank : 1;
                }
            });
        } else {
            if(category.modifier == id) {
                increase ++
            }
        }
    }

    // Calculate increase for race, profession, and skills
    calculateForCategory(oCharacter.race);
    calculateForCategory(oCharacter.profession);
    calculateForCategory(oCharacter.skill);

    return increase;
}

/**
 * Finds the index of an item in the character's specified attribute array.
 * @param {Array} sAction - The attribute to search ('skill' or 'profession').
 * @param {string} id - The main ID of the item.
 * @param {string|null} sub_id - The sub ID of the item (optional).
 * @returns {number} The index of the item if found, otherwise -1.
 */
function findItemIndex(attribute, id, sub_id = null) {
    // Access the specified attribute array directly from oCharacter
    const attributeArray = attribute;

    // Ensure the attributeArray is an array and search for the item by id and sub_id
    return Array.isArray(attributeArray) 
        ? attributeArray.findIndex(item => item?.id === id && (item?.sub_id === sub_id || sub_id === null))
        : -1;
}

/**
 * Remove elements from the character.
 * @param {string} sAction - The type of element being removed.
 * @param {Object} characterAsset - The jQuery element calling the action.
 */
function removeFromCharacter(sAction, characterAsset) {
    debugLog('removeFromCharacter', characterAsset);

    const index = findItemIndex(oCharacter[sAction], characterAsset.id, characterAsset.sub_id);

    //Remove from the character object if found, otherwise return error in console
    //Note: this should not be possible for a user to invoke unless he intentionally tries to break the UI
    if (index === -1) {
        console.error(`Trying to remove ${sAction}, non-existent`)
        return;
    }
    oCharacter[sAction].splice(index, 1)[0];

    //Remove the row from the DOM associated with the element
    let selector;    
    if (characterAsset.sub_id === null) {
        selector = `div[data-id="${characterAsset.id}"]`;
    } else {
        selector = `div[data-id="${characterAsset.id}"][data-sub_id="${characterAsset.sub_id}"]`;
    }    
    $(selector).remove();
    
    // Refund the cost of the element
    // Currently only experience and currency are spendable resources
    if (sAction === "profession" || sAction === "skill") {
        refundExperience(characterAsset.cost);
    } else if (sAction === "item") {
        refundCurrency(characterAsset.cost);
    }

    // Update the stats if there was a modifier present
    if (characterAsset.modifier) {
        updateCharacterStats();
    }

    // Update the character object in the interface
    updateCharacter();
}

/**
 * Save the character.
 */
function saveCharacter() {
    transferCharacter('save');
}

/**
 * Submit the character.
 */
function submitCharacter() {
    transferCharacter('submit');
}

/**
 * Transfer the character data.
 * @param {string} sAction - The action to perform (save or submit).
 */
function transferCharacter(sAction) {
    if (!$("#form-character").valid()) {
        console.warn('Form is not valid');
        return;
    }

    const $button = $('#submit-button');
    $button.attr('disabled', true);
    $button.html(`${icons.character_saving.icon} ${icons.character_saving.text}`);

    $.ajax({
        url: `${domain}/action/character-save`,
        type: 'POST',
        dataType: 'json',
        data: {
            action: sAction,
            character: JSON.stringify(oCharacter)
        },
        success: function() {
            $button.html(`${icons.character_save_done.icon} ${icons.character_save_done.text}`);
            $button.attr('disabled', false);
        },
        error: function() {
            $button.html(`${icons.character_error.icon} ${icons.character_error.text}`);
            $button.attr('disabled', false);
        }
    });
}

// A simple function to stringify the character object
function updateCharacter() {
    debugLog('updateCharacter',oCharacter);
    $('input[name="character"]').val(JSON.stringify(oCharacter));
}

//This function updates the stats of the character	
//---1: INCREASE_BASE_SANITY
//---2: INCREASE_BASE_HEALTH
//---3: INCREASE_BASE_DEX
//---4: INCREASE_BASE_STR
//---5: INCREASE_BASE_INTEL
//---6: INCREASE_BASE_GODPOINTS
//---7: INCREASE_BASE_MANA
//---8: INCREASE_BASE_POINTS
//---9: INCREASE_BASE_MANA_MINOR
//---10: INCREASE_BASE_CURRENCY
//---11: INCREASE_BASE_FAVOR
function updateCharacterStats() {

    // Define calculation rules
    const statMappings = {
        max_xp: { base: jsonBaseChar.max_xp, factor: 8, stat: jsonStat.xp },
        currency: { base: jsonBaseChar.currency, factor: 10, stat: jsonStat.currency },
        hp: { base: jsonBaseChar.hp, factor: 2, stat: jsonStat.hp },
        sanity: { base: jsonBaseChar.sanity, factor: 1, stat: jsonStat.sanity },
        mana: { base: jsonBaseChar.mana, factor: 7, stat: jsonStat.mana, additionalFactor: 9, additionalStat: jsonStat.mana_minor },
        gp: { base: jsonBaseChar.gp, factor: 6, stat: jsonStat.gp },
        str: { base: jsonBaseChar.str, factor: 4, stat: jsonStat.str },
        dex: { base: jsonBaseChar.dex, factor: 3, stat: jsonStat.dex },
        intel: { base: jsonBaseChar.intel, factor: 5, stat: jsonStat.intel },
        clues: { base: jsonBaseChar.intel, factor: 5, stat: jsonStat.intel },
        favour: { base: jsonBaseChar.favour, factor: 11, stat: jsonStat.favour }
    };

    // Calculate and update oCharacter.build properties
    for (const [key, { base, factor, stat, additionalFactor, additionalStat }] of Object.entries(statMappings)) {
        oCharacter.build[key] = base + (calculateIncrease(factor) * stat);
        if (additionalFactor && additionalStat) {
            oCharacter.build[key] += calculateIncrease(additionalFactor) * additionalStat;
        }
    }

    // Update the text on the sheet per modifier
    $.each(oCharacter.build, function(key, value) {
        const content = (key === "currency") ? convertCurrency(value) : value;
        $(`#stat-${key}`).html(content);
    });
}

// Export functions
export {
    addToCharacter,
    updateCharacter,
    removeFromCharacter,
    updateCharacterStats,
    saveCharacter,
    submitCharacter,
    findItemIndex
}