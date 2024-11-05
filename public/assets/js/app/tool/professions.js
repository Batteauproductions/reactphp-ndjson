//Generic settings and functions
import { domain, oCharacter, language, oTranslations } from './settings.js'
import { debugLog, checkXPCost, showMessage } from './functions.js'
import { openModal } from './modal.js'
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

//Called when a user attemps to choose a profession
function chooseProfession(obj) {
    debugLog('professionChoose',obj);
    if (typeof obj === 'object') {
        if(checkXPCost(obj.rank_1_cost)){ 
            obj.rank = 1;           
            addProfession(obj);
        } else {
            showMessage('#choice-actions','error',oTranslations[language].not_enough_vp);
        }
    } else {
        console.error("professionAdd is not an object: " +$.type(obj));
    }
}

function pickProfession() {
    debugLog('pickProfession');

    // Define modal and form
    const $modal = $('#selection-modal');
    const $form = $('#modal-form');
    const sAction = 'profession';

    // Open the modal
    openModal($modal, $form, sAction);

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

            // Create a fragment for option elements to minimize reflows
            const optionsFragment = document.createDocumentFragment();

            // Add a disabled option to ensure a conscious choice by the user
            const initialOption = $('<option>', {
                value: '',
                text: oTranslations[language].choose_option,
                selected: true,
                disabled: true
            }).get(0);

            optionsFragment.appendChild(initialOption);

            // Populate the dropdown with options
            data.forEach(item => {
                const option = $('<option>', {
                    value: item.id,
                    text: item.name
                }).get(0);

                optionsFragment.appendChild(option);
            });

            // Append options to the select element
            $select.empty().append(optionsFragment);

            // Select the first option by default
            $select.find('option:first').prop('selected', true);

            // Hide loading and show form and select
            $('div[data-id="modal-loading"]').hide();
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