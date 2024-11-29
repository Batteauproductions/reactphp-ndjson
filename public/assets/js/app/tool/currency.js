// Generic settings and functions
import { oCharacter } from '../generator.js';
import { oTranslations, language } from './settings.js';

// Page functions

/**
 * Check if the character has enough currency to buy the profession or skill.
 * @param {number} cost - The currency cost.
 * @returns {boolean} True if there is enough currency, false otherwise.
 */
function checkCurrencyCost(cost) {
    if (typeof cost !== 'number') {
        console.error("checkCurrencyCost: cost is not a number, found type: " + $.type(cost));
        return false;
    }
    return oCharacter.build.currency >= cost;
}

/**
 * Convert the character's currency into a formatted string with images.
 * @param {number|string} iAmount - The total currency amount.
 * @returns {string} The formatted currency string.
 */
function convertCurrency(iAmount) {
    const iCurrency = parseInt(iAmount, 10);
    const iGold = Math.floor(iCurrency / 100);
    const iSilver = Math.floor((iCurrency % 100) / 10);
    const iCopper = iCurrency % 10;

    const iSize = 20;
    const sGold = iGold > 0 ? `${iGold} <img title="${oTranslations[language].gold}" src="${window.location.origin}/assets/images/elements/coin_gold.png" style="height:${iSize}px; width:${iSize}px"/>` : '';
    const sSilver = iSilver > 0 ? `${iSilver} <img title="${oTranslations[language].silver}" src="${window.location.origin}/assets/images/elements/coin_silver.png" style="height:${iSize}px; width:${iSize}px"/>` : '';
    const sCopper = iCopper > 0 ? `${iCopper} <img title="${oTranslations[language].copper}" src="${window.location.origin}/assets/images/elements/coin_copper.png" style="height:${iSize}px; width:${iSize}px"/>` : '';

    return `${sGold} ${sSilver} ${sCopper}`.trim();
}

/**
 * Handle the refund of currency.
 * @param {number} cost - The currency cost to refund.
 */
function refundCurrency(cost) {
    oCharacter.build.currency += cost;
    updateCurrencyDisplay();
}

/**
 * Handle the spending of currency.
 * Checks if there is an attempt to spend more than available.
 * @param {number} cost - The currency cost to spend.
 */
function spendCurrency(cost) {
    if (oCharacter.build.currency < cost) {
        console.error('Attempt to spend more than available currency');
        oCharacter.build.currency = 0;
    } else {
        oCharacter.build.currency -= cost;
    }
    updateCurrencyDisplay();
}

/**
 * Update the displayed currency.
 */
function updateCurrencyDisplay() {
    $('#stat-currency').html(convertCurrency(oCharacter.build.currency));
}

// Export functions
export {
    checkCurrencyCost,
    convertCurrency,
    refundCurrency,
    spendCurrency
}