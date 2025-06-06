// Generic settings and functions
import { oCharacter } from '../generator.js';
import { domain, icons, jsonBaseChar, currentDateTime, jsonStat, oTranslations, language } from './settings.js';
import { debugLog, showPopup } from './functions.js';
import { updateMaxXP } from './experience.js';
import { convertCurrency } from './currency.js';
import { changeStatus } from './status.js';
import { changeType } from './type.js';
import { changeName } from './name.js';
import { pickBasekit } from './asset/equipment.js';
import { Profession } from './asset/professions.js';
import { Skill } from './asset/skills.js';
import { Item } from './asset/item.js';

// Page functions
class Character {
    constructor({        
        meta: {       
            id = null,     
            type = 1,
            type_name = '',
            status = 1,
            status_name = '',
            name = null,
            avatar = null,
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
            id: parseInt(id),
            type: parseInt(type),
            type_name: type_name,
            status: parseInt(status),
            status_name: status_name,
            avatar: avatar,
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

    setBasekit(description,value) {
        debugLog(`setBasekit: ${value}`);
        this.build.base_kit = parseInt(value);  
        $('div[data-id="base_kit-list"]').html(description);
        $('a[data-action="pick-basekit"]').html(`<i class="fa-solid fa-rotate-right"></i> aanpassen </span>`).on('click',pickBasekit);         
    }

    setName(description) {
        debugLog(`setName: ${description}`);
        this.meta.name = description; 
        $('#charactername').html(`<i class="fa-solid fa-rotate-right"></i>${description}</span>`).on('click',changeName);   
        $('input[name="char_name"]').val(description);       
    }

    setRace(description) {
        debugLog(`setRace: ${description}`);
        if(this.meta.status !== 1) {
            const $a = $('a[data-action="pick-race"]');
            const $div = $('<div>', {
                id: $a.attr('id'),
                class: $a.attr('class'),
                html: description
            });
            $a.replaceWith($div);
        } else {
            $('#race').html(`<i class="fa-solid fa-rotate-right"></i>${description}</span>`);
        }
    }

    setStatus(description,value) {
        debugLog(`setStatus: ${value}`);
        this.meta.status = parseInt(value);
        $('#characterstatus').html(`<i class="fa-solid fa-rotate-right"></i>${description}</span>`).on('click',changeStatus);
        $('input[name="char_status"]').val(value);
    }

    setType(description,value) {
        debugLog(`setType: ${value}`);
        this.meta.type = parseInt(value);
        $('#charactertype').html(`<i class="fa-solid fa-rotate-right"></i>${description}</span>`).on('click',changeType);   
        $('input[name="char_type"]').val(value);
    }
    
    save() {
       transferCharacter('save'); 
    }

    submit() {
        this.setStatus(2);
        transferCharacter('submit');
    }

    print() {
        console.log('Action not yet implemented')
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
            //currency: { base: jsonBaseChar.currency, factor: 10, stat: jsonStat.currency }, 
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
            let total = base + (calculateIncrease(factor) * stat);

            if (additionalFactor && additionalStat) {
                total += calculateIncrease(additionalFactor) * additionalStat;
            }

            // Inject dynamic max_xp boost
            if (key === 'max_xp') {
                total += updateMaxXP();
            }

            oCharacter.build[key] = total;
        }

        // Update the text on the sheet per modifier
        $.each(oCharacter.build, function(key, value) {
            const content = (key === "currency") ? convertCurrency(value) : value;
            $(`#stat-${key}`).html(content);
        });
        debugLog('updateCharacter',oCharacter);
        //transferCharacter('save'); this should be turned on eventually, but currently auto-save should NOT work.
    }

    __construct() {
        const lang = oTranslations[language];
        //--Set default information
        this.setStatus(this.meta.status_name,this.meta.status);
        this.setType(this.meta.type_name,this.meta.type);
        this.setName(this.meta.name);        
        //--Set the race by name
        if(this.race) {
            this.setRace(this.race.name);
        }
        //create new profession objects
        const tmp_prof = this.profession;
        this.profession = [];
        tmp_prof.forEach(obj => {     
            //--Add the current asset to the object
            const tmp_obj =
            {
                details: {
                    allow_multiple: obj.allow_multiple,
                    cost: obj.rank_1_cost,
                    id: obj.main_id,
                    name: obj.name,
                    max_rank: 3,
                },
                current: {
                    attribute: "profession",
                    container: "profession",
                    rank: obj.rank,
                    rank_1_cost: obj.rank_1_cost,
                    rank_2_cost: obj.rank_2_cost,
                    rank_3_cost: obj.rank_3_cost,
                    sub_id: obj.sub_id,
                    sub_name: obj.sub_name,
                },
                modifier: [
                    {
                        id: obj.modifier,
                    }
                ]
            }
            const profClass = new Profession(tmp_obj);
            profClass.rank_cost = profClass.getCurrentRankCost();
            profClass.__construct();
        });
        //create new skill objects
        const tmp_skill = this.skill;
        this.skill = [];
        tmp_skill.forEach(obj => {     
            //--Add the current asset to the object
            const tmp_obj =
            {
                details: {
                    allow_multiple: obj.allow_multiple,
                    cost: obj.cost,
                    id: obj.main_id,
                    name: obj.name,
                    max_rank: obj.name,
                },
                current: {
                    attribute: "skill",
                    container: 
                        [1, 2, 12].includes(parseInt(obj.skill_type)) ? 'skill_base' :
                        [6, 8].includes(parseInt(obj.skill_type)) ? 'skill_combat' :
                        [3, 4, 5, 10, 11].includes(parseInt(obj.skill_type)) ? 'skill_magic' :
                        'skill_base',
                    rank: obj.rank,
                    sub_id: obj.sub_id,
                    sub_name: obj.sub_name,
                    racial: obj.racial,
                    bonus: obj.bonus,
                    created_dt: obj.created_dt,
                    modified_dt: obj.modified_dt,
                },
                modifier: [
                    {
                        id: obj.modifier,
                    }
                ]
            }
            const skillClass = new Skill(tmp_obj);
            skillClass.rank_cost = skillClass.getCurrentRankCost();
            skillClass.__construct();
        });

        //create new item objects
        const tmp_item = this.item;
        this.item = [];
        tmp_item.forEach(obj => {     
            //--Add the current asset to the object
            const tmp_obj =
            {
                details: {
                    cost: obj.cost,
                    id: obj.main_id,
                    name: obj.name,
                },
                current: {
                    attribute: "item",
                    container: "item",
                    sub_id: obj.sub_id,
                    sub_name: obj.sub_name,
                    created_dt: obj.created_dt,
                    modified_dt: obj.modified_dt,
                },
                modifier: [
                    {
                        id: obj.modifier,
                    }
                ]
            }
            const itemClass = new Item(tmp_obj);
            itemClass.__construct();
        });
        //const tmp_item = this.item;
        
        this.update();
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
 * Transfer the character data.
 * @param {string} btn_action - The action to perform (save or submit).
 */
function transferCharacter(btn_action) {
    debugLog('transferCharacter', btn_action);

    if (!$("#form-character").valid()) {
        console.warn('Form is not valid');
        return;
    }

    const $button = $(`a[data-action="character-${btn_action}"]`);
    const $buttons = $('a[data-action^="character-"]');
    const lang = oTranslations[language];

    // Disable buttons and show saving icon
    $button.html(`${icons.character_saving.icon()} ${icons.character_saving.text()}`);
    $buttons.addClass('disabled').css('pointer-events', 'none');

    $.ajax({
        url: `${domain}/action/character-transfer`,
        type: 'POST',
        dataType: 'json',
        data: {
            action: btn_action,
            character: JSON.stringify(oCharacter)
        },
        success: function(data) {
            const isSuccess = data.done;
            const icon = isSuccess ? icons.character_save_done : icons.character_error;
            const popupTitle = isSuccess ? lang["popup_success"] : lang["popup_error"];
            const popupText = isSuccess ? lang["character_save_done"] : lang["character_error_save"];
            const tone = isSuccess ? 'success' : 'error';

            $button.html(`${icon.icon()} ${icon.text()}`);
            showPopup(`<h2>${popupTitle}</h2><p>${popupText}</p>`, 'inform', tone);

            if (data.id) {
                oCharacter.meta.id = data.id;
            }
        },
        error: function() {
            const icon = icons.character_error;
            const popupTitle = lang["popup_error"];
            const popupText = lang["character_error_save"];
            const tone = 'error';

            $button.html(`${icon.icon()} ${icon.text()}`);
            showPopup(`<h2>${popupTitle}</h2><p>${popupText}</p>`, 'inform', tone);
            console.error(popupText);
        },
        complete: function() {
            // Always restore button state after 3 seconds
            if(oCharacter.meta.status === 1 || oCharacter.meta.status === 3 || oCharacter.meta.status !== 7) {
                setTimeout(() => {
                    $button.html(`${icons.character_save.icon()} ${icons.character_save.text()}`);
                    $buttons.removeClass('disabled').css('pointer-events', '');
                }, 2000);
            }
        }
    });
}


// Export functions
export {
    Character,
    findItemIndex
}