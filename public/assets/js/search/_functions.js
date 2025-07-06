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

/**
 * Displays a confirmation modal before deleting a database item, then removes it via AJAX.
 *
 * @param {Event} e - The click event.
 * @param {string} sType - The type of item to delete (e.g., 'character').
 * @param {HTMLElement|jQuery} el - The clicked DOM element (can be a raw element or jQuery object).
 */
function deleteDatabaseElement(sType, el) {

    const $el = $(el);
    const char_id = $el.data('id');
    const $modal = $('#popup-modal');

    showPopup(
        `<p>${oTranslations[language].character_delete}</p>`,
        'confirm',
        'question',
        () => {
            $.ajax({
                url: `${domain}/action/${sType}-transfer`,
                type: 'POST',
                dataType: 'json',
                data: {
                    action: 'delete',
                    character: char_id
                },
                success: () => {
                    $(`div[data-character_id="${char_id}"]`).remove();
                    $modal.foundation('close');
                },
                error: () => {
                    const popupText = oTranslations[language].character_error;
                    showPopup(`<p>${popupText}</p>`, 'inform', 'error', () => {
                        $modal.foundation('close');
                    });
                    console.error(popupText);
                }
            });
        }
    );
}

export {
    sortDatabase,
    resetDatabasesort,
    deleteDatabaseElement
};
