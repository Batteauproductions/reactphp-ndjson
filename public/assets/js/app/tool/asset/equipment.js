//Generic settings and functions
import { oCharacter } from '../../generator.js';
import { openTextModal } from '../modal/text_modal.js';
import { debugLog } from '../functions.js';
import { domain } from '../settings.js';
import { openSelectionModal, updateModalDropdown, $subtypeSelect, $rankSelect } from '../modal/selection_modal.js';

function changeBasekit() {
    openTextModal('basekit',$('#text-modal'));
}

function chooseBasekit() {
    const $element = $('select[name="character-status"] option:selected');
    oCharacter.setStatus($element.val());
    $('#characterstatus').html(`<i class="fa-solid fa-rotate-right"></i>${$element.data('name')}</span>`).on('click',changeStatus);   
    $('#text-modal').foundation('close');
}

function pickBasekit() {
    debugLog('pickBasekit');
    
    // Define modal and form
    const $modal = $('#selection-modal');
    const $form = $('#modal-form');

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