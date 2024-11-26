// Generic settings and functions
import { domain, oCharacter, language, oTranslations } from './settings.js';
import { debugLog, showMessage } from './functions.js';
import { oTmpSelector, openSelectionModal, updateModalDropdown } from './modal.js';
import { Skill } from './skills.js';
import { updateCharacter, updateCharacterStats, addToCharacter } from './character.js';

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
function chooseRace(obj) {
    debugLog('pickRace', obj);

    // Validate that the input is a valid object
    if (typeof obj !== 'object' || obj === null) {
        console.error("chooseRace: 'obj' is not a valid object: " + $.type(obj));
        return;
    }

    const raceClass = new Race(obj);
    addRace(raceClass);
}

/**
 * Add a race to the character.
 * @param {Object} obj - The race object.
 */
function addRace(obj) {
    if (typeof obj !== 'object' || obj === null) {
        console.error("addRace: 'obj' is not a valid object: " + $.type(obj));
        return;
    }

    // Remove existing race and associated elements
    removeRace();

    // Assign race to character
    oCharacter.race = obj;

    // Add racial skills
    if (obj.skills.length > 0) {
        obj.skills.forEach(skill => {
            let cSkill = new Skill(skill);
            skill.add();
            //addSkill(new Skill(skill), "skill_base");
        });
    }

    // Update the stats if a modifier is present
    if (obj.modifier) {
        updateCharacterStats();
    }

    // Update the character object in the interface
    updateCharacter();

    // Allow race to be re-chosen
    $('#race').html(`<i class="fa-solid fa-rotate-right"></i>${obj.name}</span>`);
    $('#selection-modal').foundation('close');
}

/**
 * Remove a race from the character.
 */
function removeRace() {
    oCharacter.race = null;
    //remove all racial skills
    oCharacter.skill.forEach(skill => {
        
    })
}

// Export functions
export {
    pickRace,
    chooseRace,
    addRace,
    removeRace,
}