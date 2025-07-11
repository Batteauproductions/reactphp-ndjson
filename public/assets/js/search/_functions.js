import { showPopup, debugLog } from '../_lib/functions.js';
import { oTranslations, language, domain } from '../_lib/settings.js';
import { setCookieURL } from '../_lib/setCookie.js';

/**
 * Submits a form via AJAX to filter database items based on serialized form data.
 * Also stores filters in a cookie.
 *
 * @param {string} sType - The type of data to sort (e.g., 'character').
 * @param {jQuery} $el - The jQuery form element to serialize.
 */
function sortDatabase(sType, $el) {
    debugLog('sortDatabase', sType, $el);

    const formdata = $($el).serializeArray();
    const requestData = {
        action: 'search'
    };

    setCookieURL(requestData, formdata, `${sType}_filters`);

    $.ajax({
        url: `${domain}/action/${sType}-transfer`,
        type: 'POST',
        data: requestData,
        success: data => {
            $(`#sort_${sType}-result`).html(data);
        },
        error: () => {
            const popupText = oTranslations[language].system_error;
            showPopup(`<p>${popupText}</p>`, 'inform', 'error', () => {
                $('#popup-modal').foundation('close');
            });
            console.error(popupText);
        }
    });
}

/**
 * Resets the form and filters, clears Chosen dropdowns, and refreshes the results with a blank search.
 *
 * @param {string} sType - The type of data to reset (e.g., 'character').
 * @param {jQuery} $el - The jQuery element associated with the reset action (not used, but kept for interface consistency).
 */
function resetDatabasesort(sType, $el) {
    debugLog('resetDatabasesort', sType, $el);

    const $form = $(`#form-sort_${sType}`);
    $form[0].reset();
    $form.find('select').val('').trigger('chosen:updated');

    // Clear query parameters from URL
    window.history.pushState({}, '', window.location.pathname);

    $.ajax({
        url: `${domain}/action/${sType}-transfer`,
        type: 'POST',
        data: { action: 'search' },
        success: data => {
            $(`#sort_${sType}-result`).html(data);
        },
        error: () => {
            const popupText = oTranslations[language].system_error;
            showPopup(`<p>${popupText}</p>`, 'inform', 'error', () => {
                $('#popup-modal').foundation('close');
            });
            console.error(popupText);
        }
    });
}

export {
    sortDatabase,
    resetDatabasesort,
};
