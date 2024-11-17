// Generic settings and functions
import { domain, icons, oCharacter, jsonBaseChar, jsonStat, iconset } from './settings.js';
import { debugLog } from './functions.js';
import { oTmpSelector } from './modal.js';
import { spendCurrency, convertCurrency, refundCurrency } from './currency.js';
import { spendExperience, refundExperience } from './experience.js';
import { removeProfession, upgradeProfession } from './professions.js';
import { removeSkill, upgradeSkill } from './skills.js';
import { removeItem } from './equipment.js';

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

/**
 * Adds an element to the specified container in the DOM.
 * @param {string} sAction - The action type (e.g., 'skill', 'profession', 'item').
 * @param {Object} characterAsset - The element to add.
 */
function addCharacterAsset(sAction, characterAsset, selector = null) {
    if (typeof characterAsset !== 'object' || characterAsset === null) {
        console.error("addCharacterAsset: 'element' is not a valid object: " + $.type(element));
        return;
    }
    
    debugLog('addCharacterAsset', sAction, characterAsset);

    const row = $('<div>', {
        class: 'grid-x choice-row animate__animated animate__fadeInLeft',
        [`data-${sAction}_id`]: characterAsset.id, 
        [`data-${sAction}_sub_id`]: characterAsset.sub_id,
    });

    const arrColumn = [
        $('<div>', {
            'data-column': 'name',
            class: 'cell small-5 text-left',
            text: `${characterAsset.name} ${characterAsset.rank != null ? ` (${icons.rank.text} ${characterAsset.rank})` : ''}`
        })
    ];

    let local_icons;
    switch (sAction) {
        case 'skill':
        case 'profession':
            arrColumn.push($('<div>', {
                'data-column': 'sub_name',
                class: 'cell small-4 text-center',
                text: characterAsset.sub_name !== null ? characterAsset.sub_name : '-'
            }));

            arrColumn.push($('<div>', {
                'data-column': 'cost',
                class: 'cell small-1 text-right',
                html: characterAsset.race ? `${oTranslations[language].racial}` : `${characterAsset.cost}pt.`
            }));

            local_icons = characterAsset.rank !== characterAsset.max_rank ? iconset["new_skill_with_rank"] : iconset["new_skill_no_rank"];
            break;
        case 'item':
            arrColumn.push($('<div>', {
                'data-column': 'amount',
                class: 'cell small-2 text-right',
                text: `${characterAsset.amount}x`
            }));

            arrColumn.push($('<div>', {
                'data-column': 'cost',
                class: 'cell small-3 text-right',
                html: `${characterAsset.costText()}`
            }));

            local_icons = iconset["new_item"];
            break;
    }

    const actionHandlers = {
        profession: { removeFunction: removeProfession, upgradeFunction: upgradeProfession },
        skill: { removeFunction: removeSkill, upgradeFunction: upgradeSkill },
        item: { removeFunction: removeItem, upgradeFunction: null }
    };

    const { removeFunction, upgradeFunction } = actionHandlers[sAction] || {};

    const arrIcons = $.map(local_icons, function(icon) {

        let clickEventHandler = null;
        if (icon.includes('remove')) {
            clickEventHandler = removeFunction;
        } else if (icon.includes('upgrade')) {
            clickEventHandler = upgradeFunction;
        }

        const $anchor = $('<a>', {
            "data-action": `${sAction}-${icon}`,
            "data-id": characterAsset.id,
            "data-sub_id": characterAsset.sub_id,
            html: icons[icon].icon
        });

        if (clickEventHandler) {
            $anchor.on('click', function() {
                clickEventHandler(characterAsset);
            });
        }

        return $anchor;
    });

    arrColumn.push($('<div>', {
        'data-column': 'action',
        class: 'cell small-2 text-right',
        html: arrIcons
    }));

    row.append(arrColumn);

    const $container =  $(`[data-id="${oTmpSelector}-list"]`);

    let inserted = false;
    $container.children('.choice-row').each(function() {
        const currentRow = $(this);
        const currentName = currentRow.find('.cell.small-5.text-left').text().trim();
        if (currentName.localeCompare(characterAsset.name, undefined, { sensitivity: 'base' }) > 0) {
            currentRow.before(row);
            inserted = true;
            return false;
        }
    });

    if (!inserted) {
        $container.append(row);
    }
}

/**
 * Updates the character's asset and its visual representation.
 * @param {string} sAction - The action type (e.g., 'skill', 'profession', 'item').
 * @param {Object} characterAsset - The character asset object containing details like id and sub_id.
 * @param {number} index - The index of the asset in the character's asset array.
 * @param {number} new_rank - The new rank assigned to the asset.
 * @param {number} new_cost - The new cost associated with the asset.
 */
function updateCharacterAsset(sAction, characterAsset, index, new_rank, new_cost) {
    // Update the character object
    const asset = oCharacter[sAction][index];
    oCharacter.build.spend_xp -= asset.cost; // Deduct the old cost
    asset.rank = new_rank;
    asset.cost = new_cost;

    // Target the row being updated
    const subIdSelector = characterAsset.sub_id !== null ? `[data-${sAction}_sub_id="${characterAsset.sub_id}"]` : '';
    const $row = $(`div[data-${sAction}_id="${characterAsset.id}"]${subIdSelector}`);

    // Update visual elements
    $row.find('[data-column="name"]').text(`${characterAsset.name} (${icons.rank.text} ${new_rank})`);
    $row.find('[data-column="cost"]').text(`${new_cost}pt.`);

    // Spend the new cost
    spendExperience(asset.cost);

    // Update the stats if a modifier is present
    if (characterAsset.modifier) {
        updateCharacterStats();
    }

    // Update the character object in the interface
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
    const attributeArray = oCharacter[attribute];

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

    const index = findItemIndex(sAction, characterAsset.id, characterAsset.sub_id);

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
        selector = `div[data-${sAction}_id="${characterAsset.id}"]`;
    } else {
        selector = `div[data-${sAction}_id="${characterAsset.id}"][data-${sAction}_sub_id="${characterAsset.sub_id}"]`;
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
    addCharacterAsset,
    updateCharacterAsset,
    removeFromCharacter,
    updateCharacterStats,
    saveCharacter,
    submitCharacter,
    findItemIndex
}