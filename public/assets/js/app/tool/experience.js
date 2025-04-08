// Generic settings and functions
import { oCharacter } from '../generator.js';

// Functions needed for actual app performance
/**
 * Update the character's experience points (XP) by adding or subtracting a given cost.
 * @param {number} cost - The XP cost to add or subtract.
 * @param {"add"|"subtract"} action - The action to perform: "add" to spend XP, "subtract" to refund XP.
 * @returns {boolean} - Returns true if the operation is successful, false if it fails a validation check.
 */
function updateExperience(cost, action) {
    if (typeof cost !== 'number' || isNaN(cost)) {
        console.error('Invalid cost provided to updateExperience.');
        return false;
    }

    let currentXP = oCharacter.build.spend_xp;
    let maxXP = oCharacter.build.max_xp;

    if (action === 'spend') {
        if (currentXP + cost > maxXP) {
            console.error('Attempt to spend XP over the maximum allowed.');
            oCharacter.build.spend_xp = maxXP;
            updateSpendXpDisplay();
            return false;
        } else {
            oCharacter.build.spend_xp += cost;
        }
    } else if (action === 'refund') {
        if (currentXP - cost < 0) {
            console.error('Attempt to refund XP below zero.');
            oCharacter.build.spend_xp = 0;
            updateSpendXpDisplay();
            return false;
        } else {
            oCharacter.build.spend_xp -= cost;
        }
    } else {
        console.error(`Invalid action "${action}" passed to updateExperience. Use "add" or "subtract".`);
        return false;
    }

    updateSpendXpDisplay();
    return true;
}

function updateSpendXpDisplay() {
    $('#stat-spend_xp').text(oCharacter.build.spend_xp);
}

// Export functions
export {
    updateExperience,
}