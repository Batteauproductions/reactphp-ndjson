// Functions needed for actual app performance
/**
 * Update the character's experience points (XP) by adding or subtracting a given cost.
 * @param {number} cost - The XP cost to add or subtract.
 * @param {"add"|"subtract"} action - The action to perform: "add" to spend XP, "subtract" to refund XP.
 * @returns {boolean} - Returns true if the operation is successful, false if it fails a validation check.
 */
function updateExperience(cost, action) {
    if (typeof cost !== 'number' || isNaN(cost)) {
        console.error(`Invalid cost of ${cost} provided to updateExperience.`);
        return false;
    }

    let currentXP = window.character.build.spend_xp;
    let maxXP = window.character.build.max_xp;

    if (action === 'spend') {
        if (currentXP + cost > maxXP) {
            console.error('Attempt to spend XP over the maximum allowed.');
            updateSpendXpDisplay();
            return false;
        } else {
            window.character.build.spend_xp += cost;
        }
    } else if (action === 'refund') {
        if (currentXP - cost < 0) {
            console.error('Attempt to refund XP below zero.');
            updateSpendXpDisplay();
            return false;
        } else {
            window.character.build.spend_xp -= cost;
        }
    } else {
        console.error(`Invalid action "${action}" passed to updateExperience.`);
        return false;
    }

    updateSpendXpDisplay();
    return true;
}

function updateMaxXP() {
    let total = 0;
    if(window.character.meta.type == 2 || window.character.meta.type == 3) {
        total = 100;
    } else {
        const stories = window.character.stories ? window.character.stories.length : 0;
        for (let i = 1; i <= stories; i++) {
            const xp_bonus = window.arrXP[i] ?? 0;
            total += parseInt(xp_bonus);
        }
    }
    
    return total;
}

function updateSpendXpDisplay() {
    $('#stat-spend_xp').text(window.character.build.spend_xp);
}

// Export functions
export {
    updateMaxXP,
    updateExperience,
}