// Generic settings and functions
import { oTranslations, language } from '../../_lib/settings.js'

// Functions needed for actual app performance
/**
 * Update the character's experience points (XP) by adding or subtracting a given cost.
 * @param {number} cost - The XP cost to add or subtract.
 * @param {"add"|"subtract"} action - The action to perform: "add" to spend XP, "subtract" to refund XP.
 * @returns {boolean} - Returns true if the operation is successful, false if it fails a validation check.
 */
function updateCurrency(cost, action) {
    if (typeof cost !== 'number' || isNaN(cost)) {
        console.error(`Invalid cost of ${cost} provided to updateCurrency.`);
        return false;
    }

    console.log(`updateCurrency(${cost}, ${action})`)

    const current_balance = window.character.build.currency;

    if (action === 'spend') {
        if (current_balance - cost < 0) {
            console.error('No enough currency available to complete transaction.');
            return false;
        } else {
            window.character.build.currency -= cost;
        }
    } else if (action === 'refund') {
        window.character.build.currency += cost;
    } else {
        console.error(`Invalid action "${action}" passed to updateCurrency.`);
        return false;
    }

    updateCurrencyDisplay();
    return true;
}

/**
 * Update the displayed currency.
 */
function updateCurrencyDisplay() {
    console.log('window.character.build.currency', window.character.build.currency)
    $('#stat-currency').html(convertCurrency(window.character.build.currency));
}

/**
 * Convert the character's currency into a formatted string with images.
 * @param {number|string} iAmount - The total currency amount.
 * @returns {string} The formatted currency string.
 */
function convertCurrency(iAmount) {
    // Handle null, undefined, or invalid input
    let iCurrency = Number(iAmount);
    if (isNaN(iCurrency) || iCurrency === null) {
        iCurrency = 0;
    }

    const iGold = Math.floor(iCurrency / 100);
    const iSilver = Math.floor((iCurrency % 100) / 10);
    const iCopper = iCurrency % 10;

    const iSize = 20;
    const sGold = iGold > 0 ? `${iGold} <img title="${oTranslations[language].gold}" src="${window.location.origin}/assets/images/elements/coin_gold.png" style="height:${iSize}px; width:${iSize}px"/>` : '';
    const sSilver = iSilver > 0 ? `${iSilver} <img title="${oTranslations[language].silver}" src="${window.location.origin}/assets/images/elements/coin_silver.png" style="height:${iSize}px; width:${iSize}px"/>` : '';
    const sCopper = iCopper > 0 ? `${iCopper} <img title="${oTranslations[language].copper}" src="${window.location.origin}/assets/images/elements/coin_copper.png" style="height:${iSize}px; width:${iSize}px"/>` : '';

    return `${sGold} ${sSilver} ${sCopper}`.trim();
}

function pickCurrency() {

}

// Export functions
export {
    updateCurrency,
    convertCurrency,
    pickCurrency,
}