// Generic settings and functions
import { oCharacter } from '../generator.js';
import { domain, } from './settings.js';
import { debugLog } from './functions.js';
import { openSelectionModal, updateModalDropdown } from './modal/selection_modal.js';
import { Skill } from './asset/skills.js';
import { updateCharacter, updateCharacterStats } from './character.js';

// Define the class
class Race {
    constructor({
        details: {
            id,
            name,
        },
        modifier = [], // Default to an empty array for safety
        skills = [], // Default to an empty array for safety
    }) {
        this.id = parseInt(id);
        this.name = name;
        this.modifier = modifier.length > 0 && modifier[0]?.id !== undefined ? parseInt(modifier[0].id) : null;
        this.skills = skills.length > 0 ? skills : null;
    }

    // Updated method to display all attributes
    displayInfo() {
        console.log(`ID: ${this.id}`);
        console.log(`Name: ${this.name}`);
        console.log(`Modifier: ${this.modifier}`);
        console.log(`Skills: ${this.skills}`);
    }

    //adds the race to the character
    add() {
        // Assign race to character
        oCharacter.race = this;
        // Add racial skills
        if (this.skills.length > 0) {
            this.skills.forEach(skill => {
                Object.assign(skill.current, {
                    attribute: "skill",
                    container: "skill_base",
                    cost: 0,
                    racial: true
                });
                let cSkill = new Skill(skill);
                console.log('cSkill: ',cSkill);
                cSkill.add();
            });
        }        
        // Update the character object in the interface
        updateCharacter();
        // Update the stats if a modifier is present
        if (this.modifier) {
            updateCharacterStats();
        }
        // Allow race to be re-chosen
        $('#race').html(`<i class="fa-solid fa-rotate-right"></i>${this.name}</span>`);
        return true;
    }

    //removes the race from the character
    remove () {
        oCharacter.race = null;
    }
}

// Page functions

/**
 * Pick a race (functionality not implemented).
 */
function pickRace() {
    debugLog('pickRace');

    const $modal = $('#selection-modal');
    const $form = $('#modal-form');
    const sAction = 'race';

    openSelectionModal(sAction, $modal);

    $.ajax({
        url: `${domain}/action/get-dropdown`,
        type: 'POST',
        dataType: 'json',
        data: {
            action: `fill-dropdown-${sAction}`,
        },
        success: function(data) {
            debugLog('pickRace[data]', data);
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
 * Choose a race for the character.
 * @param {Object} obj - The race object.
 */
function chooseRace(sAction, obj) {
    debugLog('pickRace', obj);

    // Validate that the input is a valid object
    if (typeof obj !== 'object' || obj === null) {
        console.error("chooseRace: 'obj' is not a valid object: " + $.type(obj));
        return;
    }

    //--Add the current asset to the object
    obj.details = {
        ...obj.details,
    }
    obj.current = {
        
    }

    const raceClass = new Race(obj);

    if (raceClass.add()) {
        $('#selection-modal').foundation('close');
    }
}

// Export functions
export {
    Race,
    pickRace,
    chooseRace,
}