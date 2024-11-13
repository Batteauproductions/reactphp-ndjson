// Generic settings and functions
import { domain, icons, oCharacter, jsonBaseChar, jsonStat } from './settings.js';
import { debugLog } from './functions.js';
import { spendCurrency, convertCurrency, refundCurrency } from './currency.js';
import { spendExperience, refundExperience } from './experience.js';

// Page functions

/**
 * Add elements to the character.
 * @param {string} sAction - The type of element being added (profession, skill, item).
 * @param {Object} subject - The object representing the element being added.
 * @param {Array} attribute - The character attribute array (e.g., profession, skills, items).
 */
function addToCharacter(sAction, subject, attribute) {
    debugLog('addToCharacter');

    if (typeof subject !== 'object' || subject === null) {
        console.error("addToCharacter: 'subject' is not a valid object: " + $.type(subject));
        return;
    }

    // Add the subject to the specified attribute
    attribute.push(subject);

    // Spend experience or currency based on the type
    if (sAction === "profession" || sAction === "skill") {
        spendExperience(subject.current.cost);
    } else if (sAction === "item") {
        spendCurrency(subject.current.cost);
    }

    // Update character stats if the subject has a modifier
    if (subject.modifier && subject.modifier.length > 0) {
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
                if ($.isArray(value.modifier)) {
                    for (let i = 0; i < value.modifier.length; i++) {
                        if (value.modifier[i].id == id) {
                            increase += value.rank > 1 ? value.rank : 1;
                        }
                    }
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
    calculateForCategory(oCharacter.skills);

    return increase;
}

/**
 * Finds the index of an item in the character's attribute array.
 * @param {Array} attribute - The attribute array of the character.
 * @param {string} main_id - The main ID of the item.
 * @param {string|null} sub_id - The sub ID of the item (optional).
 * @returns {number} The index of the item if found, otherwise -1.
 */
function findItemIndex(attribute, id, sub_id = null) {
    return attribute.findIndex(item => {
        const itemMainId = item.details?.id;
        const itemSubId = item.current?.sub_id;

        return itemMainId === id && (itemSubId === sub_id || sub_id === null);
    });
}

/**
 * Remove elements from the character.
 * @param {string} sAction - The type of element being removed.
 * @param {Object} element - The jQuery element calling the action.
 * @param {Array} attribute - The character attribute array.
 */
function removeFromCharacter(sAction, element, attribute) {
    debugLog('removeFromCharacter', element);

    const { details: { id }, modifier, current: { sub_id = null, cost = null } } = element;
    const index = findItemIndex(attribute, id, sub_id);

    //Remove from the character object if found, otherwise return error in console
    //Note: this should not be possible for a user to invoke unless he intentionally tries to break the UI
    if (index === -1) {
        console.error('removeFromCharacter: Item not found');
        return;
    }
    attribute.splice(index, 1)[0];

    //Remove the row from the DOM associated with the element
    let selector;    
    if (sub_id === null) {
        selector = `div[data-id="${id}"]`;
    } else {
        selector = `div[data-id="${id}"][data-sub_id="${sub_id}"]`;
    }    
    $(selector).remove();
    
    // Refund the cost of the element
    // Currently only experience and currency are spendable resources
    if (sAction === "profession" || sAction === "skill") {
        refundExperience(cost);
    } else if (sAction === "item") {
        refundCurrency(cost);
    }

    // Update the stats if there was a modifier present
    if (modifier && modifier.length > 0) {
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