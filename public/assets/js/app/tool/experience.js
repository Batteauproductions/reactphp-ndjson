// Generic settings and functions
import { oCharacter } from './settings.js';

// Functions needed for actual app performance

/**
 * Check if the character has enough XP available to buy the profession or skill.
 * @param {number|string} cost - The XP cost as a number or string.
 * @returns {boolean} True if there is enough XP, false otherwise.
 */
function checkExperienceCost(cost) {
    const deduction = cost;
    return oCharacter.build.spend_xp + deduction <= oCharacter.build.max_xp;
}

/**
 * Handle the spending of experience.
 * Checks if there is an attempt to spend more than available.
 * @param {number} cost - The XP cost to spend.
 */
function spendExperience(cost) {
    const refund = cost;
    if (oCharacter.build.spend_xp + refund > oCharacter.build.max_xp) {
        console.error('Attempt to set XP over maximum');
        oCharacter.build.spend_xp = oCharacter.build.max_xp;
    } else {
        oCharacter.build.spend_xp += refund;
    }
    updateSpendXpDisplay();
}

/**
 * Handle the refund of experience.
 * Checks if there is an attempt to refund more than zero.
 * @param {number} cost - The XP cost to refund.
 */
function refundExperience(cost) {
    const deduction = cost;
    if (oCharacter.build.spend_xp - deduction < 0) {
        console.error('Attempt to set XP under minimum');
        oCharacter.build.spend_xp = 0;
    } else {
        oCharacter.build.spend_xp -= deduction;
    }
    updateSpendXpDisplay();
}

/**
 * Update the displayed spent XP.
 */
function updateSpendXpDisplay() {
    $('#stat-spend_xp').text(oCharacter.build.spend_xp);
}

// Export functions
export {
    checkExperienceCost,
    spendExperience,
    refundExperience
}