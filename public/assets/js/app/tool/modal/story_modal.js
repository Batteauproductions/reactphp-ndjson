import { domain } from "../settings.js";
import { debugLog } from '../functions.js';
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
function openStoryModal(sAction, $modal) {
    debugLog('openStoryModal:', sAction, $modal);

    // Initialize modal to default state
    clearModal(true);
    $modalLoading.show();
    $modal.foundation('open');

    // Variables for dynamic modal content
    let ajaxUrl = null;
    let storyId = null;
    let $form = null;
    const $textareas = $('textarea[id^="question_"]');

    // Configure based on action type
    switch (sAction) {
        case 'adventure':
            storyId = $(this).data('id');
            $form = $('#adventure-form');
            ajaxUrl = `${domain}/action/get-adventure`;
            break;
        case 'background':
            $form = $('#background-form');
            ajaxUrl = `${domain}/action/get-background`;
            break;
        default:
            console.warn(`openStoryModal, unknown sAction called with value: ${sAction}`);
            return; // Exit early for invalid actions
    }

    // Set default state to loading
    $modalLoading.show();
    $form.hide();

    // Fetch data from the server
    $.ajax({
        url: ajaxUrl,
        type: 'POST',
        data: { id: storyId },
        dataType: 'json',
        success: (data) => {
            if (data) {
                console.info('Populating modal with existing data.');
                $textareas.each(function (index) {
                    $(this).text(data[`question_${index + 1}`] || '');
                });
            } else {
                console.warn('No data available for the selected action.');
            }
        },
        error: (error) => {
            console.error('Error fetching data:', error);
        },
        complete: () => {
            // Ensure modal state is updated regardless of the result
            $modalLoading.hide();
            $form.show();
        }
    });
}

export {
    openStoryModal
}