//Generic settings and functions
import { domain, oCharacter, language, oTranslations } from './settings.js'
import { debugLog, checkXPCost, checkDupplicateItem, showMessage } from './functions.js'
import { openModal, updateModalDropdown } from './modal.js'
//Functions needed for actual app performance
import { addToCharacter, removeFromCharacter } from './character.js';

//These functions deal with adding, altering or removing professions from the character
//obj: The profession that is being parsed
function addProfession(obj) {
    debugLog('professionAdd',obj);
    if (typeof obj === 'object') {
        handleChoice('profession',obj)
        addToCharacter('profession',obj);
    } else {
        console.error("professionAdd is not an object: " +$.type(obj));
    }
}

// Called when a user attempts to choose a profession
function chooseProfession(obj) {
    debugLog('professionChoose', obj);

    // Validate if obj is an object
    if (typeof obj !== 'object' || obj === null) {
        console.error("professionAdd is not an object: " + $.type(obj));
        return;
    }

    // Destructure the necessary properties from obj
    const { details: { id, sub_id, rank_1_cost } } = obj;

    // Check XP cost
    if (!checkXPCost(rank_1_cost)) {
        showMessage('#choice-actions', 'error', oTranslations[language].not_enough_vp);
        return;
    }

    // Check for duplicate item
    if (checkDupplicateItem(oCharacter.profession, id, sub_id)) {
        showMessage('#choice-actions', 'error', oTranslations[language].duplicate_choose);
        return;
    }

    // Add profession if no errors
    obj.rank = 1;
    addProfession(oCharacter.profession);
}

function pickProfession() {
    debugLog('pickProfession');

    // Define modal and form
    const $modal = $('#selection-modal');
    const $form = $('#modal-form');
    const sAction = 'profession';

    // Open the modal
    openModal(sAction,$modal);

    // Make AJAX call to fill the dropdown
    $.ajax({
        url: `${domain}/action/get-dropdown`,
        data: {
            action: `fill-dropdown-${sAction}`,
            character: oCharacter,
        },
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            debugLog('pickProfession[data]', data);
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

//This function will remove a profession from the character
//obj: The profession that is being parsed
function removeProfession(obj) {
    debugLog('professionRemove');
    removeFromCharacter('profession',obj);
    if (typeof obj === 'object') {
        removeFromCharacter('profession',obj);
    } else {
        console.error("removeProfession is not an object: " +$.type(obj));
    }
}

//This function will upgrade a profession currently linked to the character
//obj: The profession that is being parsed
function upgradeProfession(obj) {
    debugLog('professionChoose',obj);
    if (typeof obj === 'object') {
        if(checkXPCost(obj.rank_1_cost)){            
            addProfession(obj);
        } else {
            showMessage('#choice-actions','error',oTranslations[language].not_enough_vp);
        }
    } else {
        console.error("upgradeProfession is not an object: " +$.type(obj));
    }
}

export {
    pickProfession,
    addProfession,
    chooseProfession,
    upgradeProfession,
    removeProfession,
}