//Generic settings and functions
import { debugLog } from '../../_lib/functions.js'
import { clearModal, $modalLoading, } from "./modal.js";
import { Adventure } from '../character/adventure.js';

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
    let $form = null;

    // Configure based on action type
    switch (sAction) {
        case 'adventure':
            $form = $('#form-adventure');
            $('[name="event_id"]').val(storyId);

            // Try to find an existing story with this ID
            const story = window.character.stories.find(s => parseInt(s.event_id) === parseInt(storyId));
            console.log('story', story);

            // Populate form if story exists, otherwise clear fields
            if (typeof story !== 'undefined') {
                Object.keys(story).forEach(key => {
                    if (key.startsWith('question_')) {
                        const textarea = document.querySelector(`textarea[name="${key}"]`);
                        if (textarea) {
                            textarea.value = story[key];
                        }
                    }
                });
            } else {
                $('textarea[name^="question_"]').val('');
            }

            // Handle form submission
            $form.off('submit').on('submit', function (e) {
                e.preventDefault();

                if($form.valid()) {
                    const data = {
                        event_id: $('[name="event_id"]').val()
                    };

                    for (let i = 1; i <= 6; i++) {
                        const field = this.querySelector(`[name="question_${i}"]`);
                        data[`question_${i}`] = field?.value?.trim() || null;
                    }

                    // Overwrite or add the Adventure in the character's stories
                    const existingIndex = window.character.stories.findIndex(s => parseInt(s.event_id) === parseInt(data.event_id));
                    if (existingIndex !== -1) {
                        window.character.stories[existingIndex] = new Adventure(data);
                    } else {
                        window.character.stories.push(new Adventure(data));
                    }

                    $('#adventure-modal').foundation('close');
                    window.character.update();
                }                
            });
            break;
        case 'background':
            $form = $('#background-form');
            break;
        default:
            console.warn(`openStoryModal, unknown sAction called with value: ${sAction}`);
            return; 
    }

    // Set default state to loading
    $modalLoading.hide();
    $form.show();

}

export {
    openStoryModal
}