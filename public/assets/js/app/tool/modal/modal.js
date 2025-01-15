// Static DOM Elements
const $typeSelect = $('select[name="type"]');
const $subtypeSelect = $('select[name="subtype"]');
const $rankSelect = $('input[name="rank"]');
const $typeAmount = $('[name="amount"]');
const $choice_image_container = $('#choice-image-container');
const $choice_image = $('#choice-image');
const $choice_description = $('#choice-description');
const $choice_details = $('#choice-details');
const $choice_actions = $('#choice-actions');
const $modalLoading = $('div[data-id="modal-loading"]');

/*clearForm
--
*/
function clearForm($form) {
    $form.html('');
}

/*clearModal
--bClear, weither the modal should be completely cleared
*/
function clearModal(bClear) {
    oTmpData = {};
    if(bClear) {
        $typeSelect.empty().hide();
        $typeAmount.val('1').hide();
    }    
    updateModalImage(); 
    $subtypeSelect.empty().hide();
    $choice_description.empty().hide();
    $choice_details.empty().hide();
    $choice_actions.empty().hide();
}

export {
    $typeSelect,
    $subtypeSelect,
    $rankSelect,
    $typeAmount,
    $choice_image_container,
    $choice_image,
    $choice_description,
    $choice_details,
    $choice_actions,
    $modalLoading,
    clearForm,
    clearModal,
}
