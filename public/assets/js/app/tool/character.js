// Generic settings and functions
import { oCharacter } from '../generator.js';
import { domain, icons, jsonBaseChar, currentDateTime, jsonStat } from './settings.js';
import { debugLog } from './functions.js';
import { convertCurrency } from './currency.js';

// Page functions
class Character {
    constructor({
        meta: {
            type = 1,
            status = 1,
            name = null,
            background = null,        
            created_dt = currentDateTime,
            modified_dt = null,
            firstlocked_dt = null,
            lastlocked_dt = null,
        },
        build = Object.assign({}, jsonBaseChar),
        // Default to an empty array for functionality
        race = [], 
        profession = [],
        skill = [],
        item = [],
        notes = [],
        stories = [],
    }) {
        // Assign properties to the instance's meta object
        this.meta = {
            type: parseInt(type),
            status: parseInt(status),
            name: name,
            background: background,
            created_dt: created_dt,
            modified_dt: modified_dt,
            firstlocked_dt: firstlocked_dt,
            lastlocked_dt: lastlocked_dt,
        };
        this.build = build;
        this.race = race;
        this.profession = profession;
        this.skill = skill;
        this.item = item;
        this.notes = notes;
        this.stories = stories;
    }

    setBasekit(value) {
        debugLog(`setBasekit: ${value}`);
        this.build.base_kit = parseInt(value);        
    }

    setStatus(value) {
        debugLog(`setStatus: ${value}`);
        this.meta.status = parseInt(value);
    }

    setType(value) {
        debugLog(`setType: ${value}`);
        this.meta.type = parseInt(value);
    }
    
    setName(value) {
        debugLog(`setName: ${value}`);
        this.meta.name = value;
    }

    // A simple function to stringify the character object
    update() {
        // Define calculation rules
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
        const statMappings = {
            max_xp: { base: jsonBaseChar.max_xp, factor: 8, stat: jsonStat.xp },
            //-- !!! currency SHOULD BE FIXED !!! --//
            // CURRENTLY EITHER THE SKILL WORKS OR BUYING ITEMS DOES //
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
        debugLog('updateCharacter',oCharacter);
    }

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
            if(category && category.modifier && category.modifier == id) {
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
 * @param {Array} attribute - The attribute to search ('skill' or 'profession').
 * @param {string} id - The main ID of the item.
 * @param {string|null} sub_id - The sub ID of the item (optional).
 * @returns {number} The index of the item if found, otherwise -1.
 */
function findItemIndex(attribute, id, sub_id = null) {
    // Access the specified attribute array directly from oCharacter
    const attributeArray = oCharacter[attribute];
    // Ensure the attributeArray is an array and search for the item by id and sub_id
    return Array.isArray(attributeArray) 
        ? attributeArray.findIndex(item => item?.id === id && (item?.sub_id === sub_id || sub_id === null))
        : -1;
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
 * @param {string} attribute - The action to perform (save or submit).
 */
function transferCharacter(attribute) {
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
            action: attribute,
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

// Export functions
export {
    Character,
    saveCharacter,
    submitCharacter,
    findItemIndex
}