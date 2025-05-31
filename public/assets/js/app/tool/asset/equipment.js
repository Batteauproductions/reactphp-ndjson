//Generic settings and functions
import { oCharacter } from '../../generator.js';
import { openTextModal } from '../modal/text_modal.js';
import { debugLog } from '../functions.js';
import { domain } from '../settings.js';
import { openSelectionModal, updateModalDropdown } from '../modal/selection_modal.js';

// Define modal and form
const $modal = $('#selection-modal');
const $form = $('#modal-form');

function changeBasekit() {
    openTextModal('basekit',$('#selection-modal'));
}

function chooseBasekit() {
    const $element = $('select[name="type"] option:selected');
    oCharacter.setBasekit($element.val());
    const description = $('#choice-description').find('ul');
    $('div[data-id="base_kit-list"]').html(description);
    $('a[data-action="pick-basekit"]').html(`<i class="fa-solid fa-rotate-right"></i> aanpassen </span>`).on('click',pickBasekit);   
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