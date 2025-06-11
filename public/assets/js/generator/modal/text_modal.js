//Generic settings and functions
import { debugLog } from '../../_lib/functions.js'
import { clearForm, $modalLoading, } from "./modal.js";

/** 
 * This function opens the plain text modal
 * This function is used for the following actions
 * - changing name
 * - changing type
 * - changing status
 * 
 * @param {string} sAction - The action to perform ("adventure" or "background").
 * @param {jQuery} $modal - The jQuery object representing the modal to open.
*/
function openTextModal(contentElements) {
    debugLog('openTextModal');
    $modalLoading.show();
    // Initialize modal to default state
    const $modal = $('#text-modal')
    $modal.foundation('open');
    const $form = $('#text-form');    
    clearForm($form);
    $form.append(contentElements).show();
    $modalLoading.hide();
}

export {
    openTextModal
} 