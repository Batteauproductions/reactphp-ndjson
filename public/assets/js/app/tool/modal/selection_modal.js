//Generic settings and functions
import { domain } from '../settings.js';
import { debugLog, allowChoose } from '../functions.js'
import { updateModalImage, updateModalDropdown, updateModelContent, updateModelDetails, updateModelButtons, clearModal, $typeSelect, $subtypeSelect, $rankSelect, $choice_actions, $modalLoading } from "./modal.js";


let oTmpSelector = null;

//basic function to open the modal
//requires a modal DOM element to target
//requires a action to be linked
function openSelectionModal(sAction,$modal) {
    let oTmpData = {};
    debugLog('openSelectionModal:',sAction,$modal);
    //default open state for the modal
    clearModal(true);
    $modalLoading.show();      
    $modal.foundation('open');
    //Bind functions to the elements within the modal    
    //-- changing of the 'type/subtype' select option values
    $modal.find('select[name="type"]').off('change').on('change',function() {
        clearModal();        
        //make call to collect details
        $.ajax({
            url: `${domain}/action/get-details`,
            data: {
                id: $typeSelect.val(),
                action: `get-details-${sAction}`
            },
            type: 'POST',
            dataType: 'json',
            success: function(oData) {
                debugLog('select[name="type"][data]',oData);
                oTmpData = oData;
                allowChoose();
                if (oTmpData.subtype && oTmpData.subtype.length > 0) {
                    updateModalDropdown($subtypeSelect, oTmpData.subtype);
                    $subtypeSelect.show();
                } else {
                    $subtypeSelect.hide();
                }
                updateModal(sAction,oTmpData);
            },
            error: function(error) {
                console.error(error);
            }
        });
    });
    $modal.find('select[name="subtype"]').off('change').on('change',function() {
        oTmpData.current = {
            sub_id: $subtypeSelect.val(),
            sub_name: $subtypeSelect.text(),
        }
        allowChoose();
        updateModal(sAction,oTmpData); 
    });
    //-- changing of the rank input field
    $modal.find('input[name="rank"]').off('change').on('change',function() {
        const value = $(this).val();
        $('#rank_cost').text(calculateSkillCost(oTempData,value));
    });
}

//This function updates the modal image
//Checks the id and sub_id, uses different path which is available
function updateModal (sAction,oData) {
    debugLog('updateModal: ', sAction, oData);
    //update parts of the Modal
    if(sAction === 'profession' || sAction === 'race') {
        updateModalImage(sAction,oData);
    } else {
        updateModalImage();
    }    
    updateModelContent(oData.details);
    updateModelDetails(sAction,oData.details,oData.modifier,oData.skills);
    updateModelButtons(sAction,oData);
    //items allow amount to be chosen
    if(sAction == 'item') {
        $('[name="amount"]').show();
    } else {
        $('[name="amount"]').hide();
    }
}



export {
    oTmpSelector,
    $subtypeSelect,
    $rankSelect,
    openSelectionModal,
    clearModal,
    updateModalDropdown
} 