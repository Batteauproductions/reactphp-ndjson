// Generic settings and functions
import { domain, icons, oCharacter, jsonBaseChar, jsonStat } from './settings.js';
import { debugLog } from './functions.js';
import { spendCurrency, convertCurrency } from './currency.js';
import { spendExperience } from './experience.js';

// Page functions

/**
 * Add elements to the character.
 * @param {Array} attribute - The character attribute array (e.g., profession, skills, items).
 * @param {string} type - The type of element being added (profession, skill, item).
 * @param {Object} subject - The object representing the element being added.
 */
function addToCharacter(attribute, type, subject) {
    debugLog('addToCharacter');

    if (typeof subject !== 'object' || subject === null) {
        console.error("addToCharacter: 'subject' is not a valid object: " + $.type(subject));
        return;
    }

    // Add the subject to the specified attribute
    attribute.push(subject);

    // Spend experience or currency based on the type
    if (type === "profession" || type === "skill") {
        spendExperience(subject.cost);
    } else if (type === "item") {
        spendCurrency(subject.cost);
    }

    // Update character stats if the subject has a modifier
    if (subject.modifier && subject.modifier.length > 0) {
        updateCharacterStats();
    }

    // Update the visual part of the character sheet
    updateCharacter();
}

/**
 * Remove elements from the character.
 * @param {Array} attribute - The character attribute array.
 * @param {Object} element - The jQuery element calling the action.
 * @param {string} type - The type of element being removed.
 * @param {string} main_id - The main ID of the element.
 * @param {string|null} sub_id - The sub ID of the element (optional).
 */
function removeFromCharacter(attribute, element, type, main_id, sub_id = null) {
    debugLog('removeFromCharacter');
    let itemFound = false;
    let subject = {};

    // Find and remove the item from the attribute array
    for (let i = 0; i < attribute.length; i++) {
        if (attribute[i].main_id === main_id && attribute[i].sub_id === sub_id) {
            subject = attribute[i];
            attribute.splice(i, 1);
            itemFound = true;
            break;
        }
    }

    if (!itemFound) {
        console.error('removeFromCharacter: Item not found');
        return;
    }

    // Handle refund and update based on the type
    if (subject.modifier && subject.modifier.length > 0) {
        updateCharacterStats();
    }
    if (type === "profession" || type === "skill") {
        experienceRefund(subject.cost);
    } else if (type === "item") {
        currencyRefund(subject.cost);
    }

    // Remove the element from the DOM
    element.parent().parent().remove();
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

// A simple function to stringify the character object
function updateCharacter() {
    $('input[name="character"]').val(JSON.stringify(oCharacter));
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
    submitCharacter
}