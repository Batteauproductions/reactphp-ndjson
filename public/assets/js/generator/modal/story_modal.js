//Generic settings and functions
import { domain } from '../../_lib/settings.js';
import { debugLog } from '../../_lib/functions.js'
import { clearModal, $modalLoading, } from "./modal.js";

/**
 * Opens the modal for the submission of stories.
 * This function supports the following actions:
 * - Writing the background
 * - Writing adventures
 *
 * @param {string} sAction - The action to perform ("adventure" or "background").
 * @param {jQuery} $modal - The jQuery object representing the modal to open.
 */
function openStoryModal(sAction, $modal, storyId=null) {
    debugLog('openStoryModal:', sAction, $modal, storyId);

    // Initialize modal to default state
    clearModal(true);
    $modalLoading.show();
    $modal.foundation('open');

    // Variables for dynamic modal content
    let ajaxUrl = null;
    let $form = null;
    const $textareas = $('textarea[id^="question_"]');

    // Configure based on action type
    switch (sAction) {
        case 'adventure':
            $form = $('#adventure-form');
            const story = window.character.stories.find(s => parseInt(s.event_id) === storyId);
            if (story) {
                Object.keys(story).forEach(key => {
                    if (key.startsWith('question_')) {
                        const textarea = document.querySelector(`textarea[name="${key}"]`);
                        if (textarea) {
                            textarea.value = story[key];
                        }
                    }
                });
            }
            break;
        case 'background':
            $form = $('#background-form');
            break;
        default:
            console.warn(`openStoryModal, unknown sAction called with value: ${sAction}`);
            return; // Exit early for invalid actions
    }

    // Set default state to loading
    $modalLoading.hide();
    $form.show();

}

export {
    openStoryModal
}