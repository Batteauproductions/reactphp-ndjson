// Generic settings and functions
import { oCharacter } from '../generator.js';
import { domain, icons, jsonBaseChar, currentDateTime, jsonStat, iconset } from './settings.js';
import { debugLog, generateIconSet } from './functions.js';
import { spendCurrency, convertCurrency, refundCurrency } from './currency.js';
import { spendExperience, refundExperience } from './experience.js';

// Page functions
class Character {
    constructor({
        meta: {
            type = 1,
            status = 1,
            name = null,
            background = null,        
            created_dt = currentDateTime.toISOString(),
            modified_dt = null,
            firstlocked_dt = null,
            lastlocked_dt = null,
        },
        build = Object.assign({}, jsonBaseChar),
        race = [], // Default to an empty array for safety
        profession = [],
        skill = [],
        item = [],
        stories = [], // Fix syntax error and provide default
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
        this.stories = stories;
    }

    addAsset (attribute,asset) {
        // Add the asset to the specified attribute
        this[attribute].push(asset);
        // Spend experience or currency based on the type
        if (attribute === "profession" || attribute === "skill") {
            spendExperience(asset.cost);
        } else if (attribute === "item") {
            spendCurrency(asset.cost);
        }
        // Update character stats if the subject has a modifier
        if (asset.modifier) {
            updateCharacterStats();
        }
        // Update the character object in the interface
        updateCharacter();
    }

    updateAsset (attribute,index,new_rank,new_cost,new_icons) {
        // Update the character object
        const asset = this[attribute][index];
        oCharacter.build.spend_xp -= asset.cost; // Deduct the old cost
        asset.rank = new_rank;
        asset.cost = new_cost;

        // Target the row being updated
        const subIdSelector = asset.sub_id !== null ? `[data-${attribute}_sub_id="${asset.sub_id}"]` : '';
        const $row = $(`div[data-${attribute}_id="${asset.id}"]${subIdSelector}`);

        // Update visual elements
        $row.find('[data-column="name"]').text(`${asset.name} (${icons.rank.text} ${new_rank})`);
        $row.find('[data-column="cost"]').text(`${new_cost}pt.`);
        $row.find('[data-column="action"]').html(new_icons);

        // Spend the new cost
        spendExperience(asset.cost);

        // Update the stats if a modifier is present
        if (asset.modifier) {
            updateCharacterStats();
        }

        // Update the character object in the interface
        updateCharacter();
    }

    removeAsset (attribute,asset) {
        const index = findItemIndex(attribute, asset.id, asset.sub_id);

        //Remove from the character object if found, otherwise return error in console
        //Note: this should not be possible for a user to invoke unless he intentionally tries to break the UI
        if (index === -1) {
            console.error(`Trying to remove ${attribute}, non-existent`)
            return;
        }
        oCharacter[attribute].splice(index, 1)[0];
    
        // Target the row being updated
        const subIdSelector = asset.sub_id !== null ? `[data-${attribute}_sub_id="${asset.sub_id}"]` : '';
        const $row = $(`div[data-${attribute}_id="${asset.id}"]${subIdSelector}`);
        $row.remove();
        
        // Refund the cost of the element
        if (attribute === "profession" || attribute === "skill") {
            refundExperience(asset.cost);
        } else if (attribute === "item") {
            refundCurrency(asset.cost);
        }

        // Update the stats if there was a modifier present
        if (asset.modifier) {
            updateCharacterStats();
        }

        // Update the character object in the interface
        updateCharacter();
    }

    addAssetToSheet (attribute,asset) {
        const row = $('<div>', {
            class: 'grid-x choice-row animate__animated animate__fadeInLeft',
            [`data-${attribute}_id`]: asset.id, 
            [`data-${attribute}_sub_id`]: asset.sub_id,
        });
    
        const arrColumn = [
            $('<div>', {
                'data-column': 'name',
                class: 'cell small-5 medium-4 text-left',
                text: `${asset.name} ${asset.rank != asset.max_rank ? ` (${icons.rank.text} ${asset.rank})` : ''}`
            })
        ];
    
        let local_icons;
        switch (attribute) {
            case 'skill':
            case 'profession':
                arrColumn.push($('<div>', {
                    'data-column': 'sub_name',
                    class: 'cell small-5 medium-4 text-center',
                    text: asset.sub_name !== null ? asset.sub_name : '-'
                }));
    
                arrColumn.push($('<div>', {
                    'data-column': 'cost',
                    class: 'cell small-2 medium-1 text-right',
                    html: asset.race ? `${oTranslations[language].racial}` : `${asset.cost}pt.`
                }));
    
                local_icons = asset.rank !== asset.max_rank ? iconset["attribute_adjust_up"] : iconset["attribute_adjust_none"];
                break;
            case 'item':
                arrColumn.push($('<div>', {
                    'data-column': 'amount',
                    class: 'cell small-5 medium-4 text-right',
                    text: `${asset.amount}x`
                }));
    
                arrColumn.push($('<div>', {
                    'data-column': 'cost',
                    class: 'cell small-4 medium-3 text-right',
                    html: `${asset.costText()}`
                }));
    
                local_icons = iconset["attribute_adjust_none"];
                break;
        }
        
        //--fills the column of icons with the correct iconset
        const arrIcons = generateIconSet(local_icons,asset,attribute);
        arrColumn.push($('<div>', {
            'data-column': 'action',
            class: 'cell small-12 medium-3 text-center medium-text-right',
            html: arrIcons
        }));
    
        row.append(arrColumn);
        const $container = $(`[data-id="${asset.container}-list"]`);
        let inserted = false;
        
        $container.children('.choice-row').each(function() {
            const currentRow = $(this);
            const currentName = currentRow.find('.cell.small-5.text-left').text().trim();
            if (currentName.localeCompare(asset.name, undefined, { sensitivity: 'base' }) > 0) {
                currentRow.before(row);
                inserted = true;
                return false;
            }
        });
    
        if (!inserted) {
            $container.append(row);
        }
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
    Character,
    updateCharacter,
    updateCharacterStats,
    saveCharacter,
    submitCharacter,
    findItemIndex
}