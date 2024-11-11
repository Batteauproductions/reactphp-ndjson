// Generic settings and functions
import { oCharacter } from './settings.js';
import { debugLog, showMessage } from './functions.js';
import { openModal } from './modal.js';
import { addSkill } from './skills.js';
import { updateCharacter, updateCharacterStats, removeFromCharacter } from './character.js';

// Page functions

/**
 * Pick a race (functionality not implemented).
 */
function pickRace() {
    // Implementation needed
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
    removeRace(obj);

    // Declare a new usable race variable
    const oRace = {
        id: parseInt(obj.details.id, 10),
        modifier: null
    };

    // Determine race modifier
    if (obj.modifier && obj.modifier.length > 0) {
        oRace.modifier = parseInt(obj.modifier.length > 1 ? $('input[name="stat-modifier"]:checked').val() : obj.modifier[0].id, 10);
    }

    // Add racial skills
    if (choice_skills.length > 0) {
        for (let i = 0; i < choice_skills.length; i++) {
            addSkill(choice_skills[i]);
            elementAdd("skill_base-list", choice_skills[i], "skill");
        }
        choice_skills.length = 0;
    }

    // Assign race to character
    oCharacter.race = oRace;
    updateCharacterStats();
    updateCharacter();

    // Allow race to be re-chosen
    $('#race').html(`<i class="fa-solid fa-rotate-right"></i>${obj.details.name}</span>`);
    $('#selection-modal').foundation('close');
}

/**
 * Remove a race from the character.
 * @param {Object} obj - The race object.
 */
function removeRace(obj) {
    oCharacter.race = {};

    // Remove skills associated with the race
    oCharacter.skills.forEach(skill => {
        const { main_id, sub_id } = skill;
        removeFromCharacter(oCharacter.skills, 'skill_base-list', 'skill', main_id, sub_id);
    });

    // Filter out skills associated with the race
    oCharacter.skills = oCharacter.skills.filter(skill => {
        return !(obj.skills && obj.skills[skill.main_id] === true);
    });

    updateCharacterStats();
    updateCharacter();
}

// Export functions
export {
    addRace,
    pickRace,
    removeRace,
}