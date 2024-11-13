// Generic settings and functions
import { domain, oCharacter, language, oTranslations } from './settings.js';
import { debugLog, showMessage, addElement } from './functions.js';
import { checkExperienceCost } from './experience.js';
import { openModal, updateModalDropdown } from './modal.js';
import { addToCharacter, removeFromCharacter, findItemIndex } from './character.js';

/*
Logical progression for the user interactions explained:
//-1-- The action you invoke on the UX is that you pick a profession via the function: pickProfession
//-2-- Then you make choice from the options available to you by: chooseProfession
//-3-- After the choice is validated, it is then added to the character by: addProfession
//-4a- Once the profession is added to the character you can remove it again by: removeProfession
//-4b- If available you can also upgrade the level of your profession by: upgradeProfession 
*/

// Page functions

/**
 * Pick a profession from a modal.
 */
function pickProfession() {
    debugLog('pickProfession');

    const $modal = $('#selection-modal');
    const $form = $('#modal-form');
    const sAction = 'profession';

    openModal(sAction, $modal);

    $.ajax({
        url: `${domain}/action/get-dropdown`,
        type: 'POST',
        dataType: 'json',
        data: {
            action: `fill-dropdown-${sAction}`,
            character: oCharacter,
        },
        success: function(data) {
            debugLog('pickProfession[data]', data);
            const $select = $('select[name="type"]');
            $('div[data-id="modal-loading"]').hide();
            updateModalDropdown($select, data);
            $form.show();
            $select.show();
        },
        error: function(error) {
            console.error('pickProfession: Error fetching data:', error);
        }
    });
}

/**
 * Choose a profession for the character.
 * @param {Object} obj - The profession object.
 */
function chooseProfession(obj) {
    debugLog('professionChoose', obj);

    if (typeof obj !== 'object' || obj === null) {
        console.error("chooseProfession: 'obj' is not a valid object: " + $.type(obj));
        return;
    }

    //--Add the current attribute to the object
    const $subtype = $('input[name="subtype"]');
    obj.current = { 
        sub_id: $subtype.val() ? parseInt($subtype.val()) : null,
        sub_name: $subtype.text() ? $subtype.text() : null,
        rank: 1,
        cost: parseInt(obj.details.rank_1_cost)
    }

    //--Nested destructuring of the Object
    const { details: { id, rank_1_cost }, current: { sub_id} } = obj;

    if (!checkExperienceCost(rank_1_cost)) {
        showMessage('#choice-actions', 'error', oTranslations[language].not_enough_vp);
        return;
    }

    if (findItemIndex(oCharacter.profession, id, sub_id) !== -1) {
        showMessage('#choice-actions', 'error', oTranslations[language].duplicate_choose);
        return;
    }

    addProfession(obj);
}

/**
 * Add a profession to the character.
 * @param {Object} obj - The profession object.
 */
function addProfession(obj) {
    if (typeof obj !== 'object' || obj === null) {
        console.error("addProfession: 'obj' is not a valid object: " + $.type(obj));
        return;
    }

    debugLog('professionAdd', obj);
    addElement('profession', obj);
    addToCharacter('profession', obj, oCharacter.profession);
    $('#selection-modal').foundation('close');
}

/**
 * Remove a profession from the character.
 * @param {Object} obj - The profession object.
 */
function removeProfession(obj) {
    if (typeof obj !== 'object' || obj === null) {
        console.error("removeProfession: 'obj' is not a valid object: " + $.type(obj));
        return;
    }

    debugLog('professionRemove', obj);
    removeFromCharacter('profession', obj, oCharacter.profession);
}

/**
 * Upgrade a profession linked to the character.
 * @param {Object} obj - The profession object.
 */
function upgradeProfession(obj) {
    if (typeof obj !== 'object' || obj === null) {
        console.error("upgradeProfession: 'obj' is not a valid object: " + $.type(obj));
    }

    const { details: { id, rank_1_cost, rank_2_cost, rank_3_cost } , current: {sub_id, rank} } = obj;

    debugLog('professionUpgrade', obj);

    if (findItemIndex(oCharacter.profession, id, sub_id) !== -1) {
        console.error('Trying to upgrade profession, non-existent')
        return;
    }



}

// Export functions
export {
    pickProfession,
    chooseProfession,
    addProfession,     
    removeProfession,
    upgradeProfession,
}