// Generic settings and functions
import { domain, icons, currentDateTime, oTranslations, language } from '../../_lib/settings.js';
import { debugLog, showPopup } from '../../_lib/functions.js';
import { updateMaxXP } from '../helper/experience.js';
import { convertCurrency } from '../helper/currency.js';
import { changeStatus } from './status.js';
import { changeType } from './type.js';
import { changeName } from './name.js';
import { pickBasekit } from './equipment.js';
import { Profession } from '../character_asset/professions.js';
import { Skill } from '../character_asset/skills.js';
import { Item } from '../character_asset/item.js';
import { character_note } from '../character/note.js'

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
        build = Object.assign({}, window.jsonBaseChar),
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
            id: id,
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
        debugLog(`setBasekit: ${description} ${value}`);
        this.build.base_kit = parseInt(value);  
        $('div[data-id="basekit-list"]').html(description);
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
        debugLog(`setStatus: ${description} ${value}`);
        this.meta.status = parseInt(value);
        $('#characterstatus').html(`<i class="fa-solid fa-rotate-right"></i>${description}</span>`).on('click',changeStatus);
        $('input[name="char_status"]').val(value);
    }

    setType(description,value) {
        debugLog(`setType: ${description} ${value}`);
        this.meta.type = parseInt(value);
        $('#charactertype').html(`<i class="fa-solid fa-rotate-right"></i>${description}</span>`).on('click',changeType);   
        $('input[name="char_type"]').val(value);
    }
    
    save() {
       transferCharacter('save'); 
    }

    submit(description,value) {
        this.setStatus(description,value);
        transferCharacter('submit');
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
            max_xp: { base: window.jsonBaseChar.max_xp, factor: 8, stat: window.jsonStat.xp },
            //-- !!! currency SHOULD BE FIXED !!! --//
            // CURRENTLY EITHER THE SKILL WORKS OR BUYING ITEMS DOES //
            //currency: { base: window.jsonBaseChar.currency, factor: 10, stat: window.jsonStat.currency }, 
            hp: { base: window.jsonBaseChar.hp, factor: 2, stat: window.jsonStat.hp },
            sanity: { base: window.jsonBaseChar.sanity, factor: 1, stat: window.jsonStat.sanity, additionalFactor: 12, additionalStat: window.jsonStat.decrease_sanity },
            mana: { base: window.jsonBaseChar.mana, factor: 7, stat: window.jsonStat.mana, additionalFactor: 9, additionalStat: window.jsonStat.mana_minor },
            gp: { base: window.jsonBaseChar.gp, factor: 6, stat: window.jsonStat.gp },
            str: { base: window.jsonBaseChar.str, factor: 4, stat: window.jsonStat.str },
            dex: { base: window.jsonBaseChar.dex, factor: 3, stat: window.jsonStat.dex },
            intel: { base: window.jsonBaseChar.intel, factor: 5, stat: window.jsonStat.intel },
            clues: { base: window.jsonBaseChar.intel, factor: 5, stat: window.jsonStat.intel },
            favour: { base: window.jsonBaseChar.favour, factor: 11, stat: window.jsonStat.favour }
        };

        // Calculate and update window.character.build properties
        for (const [key, { base, factor, stat, additionalFactor, additionalStat }] of Object.entries(statMappings)) {
            let total = base + (calculateIncrease(factor) * stat);
            // Check for additional factors or stats
            if (additionalFactor && additionalStat) {
                total += calculateIncrease(additionalFactor) * additionalStat;
            }
            // Inject dynamic max_xp boost
            if (key === 'max_xp') {
                total += updateMaxXP();
            }
            // Set the total value of the build based on key
            window.character.build[key] = parseInt(total);
        }

        // Update the text on the sheet per modifier
        $.each(window.character.build, function(key, value) {
            const content = (key === "currency") ? convertCurrency(value) : value;
            $(`#stat-${key}`).html(content);
        });

        if(window.character.build.favour > 0) {
            $('#patron-favour').show();
        } else {
            $('#patron-favour').hide();
        }
        debugLog('updateCharacter',window.character);
        //transferCharacter('save'); this should be turned on eventually, but currently auto-save should NOT work.
    }

    __construct() {
        // This function is meant to recreate all the character asset classes.
        // When a existing character is parsed, it is an json object, 
        // however the objects are not defined as classes within the character class.

        // Set default visual information
        //-- Since these fields are required upon creation they can be set without checks
        this.setStatus(this.meta.status_name,this.meta.status);
        this.setType(this.meta.type_name,this.meta.type);
        this.setName(this.meta.name);    
        this.setBasekit(this.build.base_kit_description, this.build.base_kit);
        //-- Convert strings to integers
        this.build.spend_xp = parseInt(this.build.spend_xp);
        this.build.currency = parseInt(this.build.currency);
        //-- Set the race by name
        if(this.race) { this.setRace(this.race.name) }

        // Usage:
        this.profession = createAssets(this.profession, Profession, 'profession', null, 3);
        this.skill = createAssets(this.skill, Skill, 'skill', resolveSkillContainer);
        this.item = createAssets(this.item, Item, 'item');

        //-- Create new note class objects on the character 
        const tmp_note = this.notes[0];
        this.notes = [];
        const targetKeys = ["player_notes", "sl_notes","sl_private_notes"];
        Object.entries(tmp_note).forEach(([key, value]) => {
            if (targetKeys.includes(key) && value !== null ) {
                const noteClass = new character_note(key,value);
                noteClass.add();
            }
        });
        
        this.update();
    }

}

/**
 * Create asset class instances from raw objects.
 * @param {Array} rawAssets Array of raw asset objects.
 * @param {Function} AssetClass The class constructor (Profession, Skill, Item).
 * @param {string} attribute Attribute type ('profession', 'skill', 'item').
 * @param {Function} [containerResolver] Optional function to determine container for skill.
 * @param {number|null} [defaultMax=null] Optional default max asset value (used for profession).
 */
function createAssets(rawAssets, AssetClass, attribute, containerResolver, defaultMax = null) {
    const assets = [];
    rawAssets.forEach(obj => {
        /** @type {object} */
        const tmp_obj = {
            details: {
                cost: obj.cost,
                id: obj.main_id,
                name: obj.name,
                description: obj.description,
                allow_multiple: obj.allow_multiple,
                asset_value_max: obj.asset_value_max,
            },
            current: {
                attribute,
                container: containerResolver ? containerResolver(obj) : attribute,
                asset_value: obj.asset_value,                
                sub_id: obj.sub_id,
                sub_name: obj.sub_name,
                created_dt: obj.created_dt,
                modified_dt: obj.modified_dt,
            },
            modifier: [{ id: obj.modifier }]
        };

        // Add additional known fields based on type
        if(attribute === 'skill') {
            tmp_obj.current.racial = obj.racial;
            tmp_obj.current.bonus = obj.bonus;
        }

        const instance = new AssetClass(tmp_obj);
        instance.asset_value_cost = instance.getCurrentAssetValueCost();
        
        // Call explicit constructor if exists
        if(typeof instance.__construct === 'function') {
            instance.__construct();
        }

        assets.push(instance);
    });
    return assets;
}

/**
 * Determines skill container based on skill_type.
 * @param {object} obj Skill raw object.
 * @returns {string} Skill container string.
 */
function resolveSkillContainer(obj) {
    const type = parseInt(obj.skill_type);
    if ([1, 2, 12].includes(type)) return 'skill_base';
    if ([6, 8, 13].includes(type)) return 'skill_combat';
    if ([4, 5, 11].includes(type)) return 'skill_magic';
    if ([3, 10].includes(type)) return 'skill_divine';
    return 'skill_base';
}

function calculateIncrease(id) {
    let increase = 0;
    // Helper function to calculate the increase for each category
    var calculateForCategory = (category) => {
        if ($.isArray(category)) {
            $.each(category, function(key, value) {
                if (value.modifier == id) {
                    increase += value.asset_value > 1 ? value.asset_value : 1;
                }
            });
        } else {
            if(category && category.modifier && category.modifier == id) {
                increase ++
            }
        }
    }

    // Calculate increase for race, profession, and skills
    calculateForCategory(window.character.race);
    calculateForCategory(window.character.profession);
    calculateForCategory(window.character.skill);

    return increase;
}

/**
 * Finds the index of an item in the character's specified attribute array.
 * @param {Array} attribute - The attribute to search ('skill' or 'profession').
 * @param {string} id - The main ID of the item.
 * @param {string|null} sub_id - The sub ID of the item (optional).
 * @returns {number} The index of the item if found, otherwise -1.
 */
function findItemIndex(attribute, id, sub_id = null, asset_value = null, strictSubId = true) {
    const attributeArray = window.character[attribute];

    return Array.isArray(attributeArray)
        ? attributeArray.findIndex(item =>
            item?.id === id &&
            (strictSubId ? (item?.sub_id === sub_id || sub_id === null) : true) &&
            (item?.asset_value >= asset_value || asset_value === null)
        )
        : -1;
}

/**
 * Finds the index of a skill in the character's skill array that is linked to a specific profession.
 * @param {string} professionId - The main profession ID.
 * @param {string|null} subId - The optional sub profession ID.
 * @param {boolean} strictSubId - If true, subId must match exactly (or be null); otherwise, subId is ignored.
 * @returns {number} The index of the matching skill if found, otherwise -1.
 */
function findLinkedSkillIndex(professionId, subId = null, strictSubId = true) {
    const skills = window.character.skill;

    if (!Array.isArray(skills)) return -1;

    return skills.findIndex(skill =>
        skill &&
        skill.profession_link === professionId &&
        (strictSubId ? (skill.profession_sublink === subId || subId === null) : true)
    );
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

    let formData = new FormData();

    // Add JSON data
    formData.append('action', btn_action);
    formData.append('char_name', $('[name="char_name"]').val())
    formData.append('character', JSON.stringify(window.character));

    if (window.remove_asset.length > 0) {
        formData.append('remove_assets', JSON.stringify(window.remove_asset));
    }

    // Add file (avatar)
    const avatarFile = document.getElementById('avatar').files[0];
    if (avatarFile) {
        formData.append('avatar', avatarFile);
    }

    // Run the ajax
    $.ajax({
        url: `${domain}/action/character-transfer`,
        type: 'POST',
        dataType: 'json',
        data: formData,
        processData: false,       // Important for file upload
        contentType: false,       // Important for file upload
        success: function(data) {
            const isSuccess = data.done;
            const icon = isSuccess ? icons.character_save_done : icons.character_error;
            const popupTitle = isSuccess ? lang["popup_success"] : lang["popup_error"];
            const popupText = isSuccess ? lang["character_save_done"] : lang["character_error_save"];
            const tone = isSuccess ? 'success' : 'error';
            const confirm = btn_action == 'save' 
                        ? function () { 
                            //only refresh page to edit when it's a new character
                            if(isNaN(window.character.meta.id)) {
                                window.location.href = `${domain}/user/character/edit/${data.id}`;
                                window.character.meta.id = data.id;
                            }  
                        } 
                        : function () { window.location.href = `${domain}/user/character/database`; };

            $button.html(`${icon.icon()} ${icon.text()}`);
            showPopup(`<h2>${popupTitle}</h2><p>${popupText}</p>`, 'inform', tone, confirm);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Status:", textStatus);
    console.log("Error Thrown:", errorThrown);
    console.log("Raw Response:", jqXHR.responseText); // This is probably what you need
    
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
            if(window.character.meta.status === 1 || window.character.meta.status === 3 || window.character.meta.status === 7) {
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
    findItemIndex,
    findLinkedSkillIndex,
}