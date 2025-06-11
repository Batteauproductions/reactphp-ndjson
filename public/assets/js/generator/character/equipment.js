//Generic settings and functions
import { openTextModal } from '../modal/text_modal.js';
import { debugLog } from '../../_lib/functions.js';
import { domain } from '../../_lib/settings.js';
import { openSelectionModal, updateModalDropdown } from '../modal/selection_modal.js';

// Define modal and form
const $modal = $('#selection-modal');
const $form = $('#modal-form');

function changeBasekit() {
    openTextModal('basekit',$('#selection-modal'));
}

function chooseBasekit() {
    const $element = $('select[name="type"] option:selected');
    const description = $('#choice-description').find('ul');
    window.character.setBasekit(description,$element.val());    
    $modal.foundation('close');
}

function pickBasekit() {
    debugLog('pickBasekit');

    // Open the modal
    openSelectionModal('basekit',$modal);

    // Make AJAX call to fill the dropdown
    $.ajax({
        url: `${domain}/action/get-dropdown`,
        data: {
            action: `fill-dropdown-basekit`,
        },
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            debugLog('pickBasekit[data]', data);
            const $select = $('select[name="type"]');            
            // Hide loading and show form and select
            $('div[data-id="modal-loading"]').hide();
            updateModalDropdown($select, data);
            $form.show();
            $select.show();
        },
        error: function(error) {
            console.error('Error:', error);
        }
    }); 
}

export {
    changeBasekit,
    chooseBasekit,
    pickBasekit,
}