// Generic settings and functions
import { domain, oCharacter, language, oTranslations } from './settings.js';
import { debugLog, checkDupplicateItem, showMessage, addElement } from './functions.js';
import { checkExperienceCost } from './experience.js';
import { openModal, updateModalDropdown } from './modal.js';
import { addToCharacter, removeFromCharacter } from './character.js';

// Page functions

/**
 * Add a profession to the character.
 * @param {Object} obj - The profession object.
 */
function addProfession(obj) {
    debugLog('professionAdd', obj);
    if (typeof obj === 'object' && obj !== null) {
        addElement('profession', obj);
        addToCharacter(oCharacter.profession, 'profession', obj);
        $('#selection-modal').foundation('close');
    } else {
        console.error("addProfession: 'obj' is not a valid object: " + $.type(obj));
    }
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

    const { details: { id, sub_id, rank_1_cost } } = obj;

    if (!checkExperienceCost(rank_1_cost)) {
        showMessage('#choice-actions', 'error', oTranslations[language].not_enough_vp);
        return;
    }

    if (checkDupplicateItem(oCharacter.profession, id, sub_id)) {
        showMessage('#choice-actions', 'error', oTranslations[language].duplicate_choose);
        return;
    }

    obj.rank = 1;
    addProfession(obj);
}

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
 * Remove a profession from the character.
 * @param {Object} obj - The profession object.
 */
function removeProfession(obj) {
    debugLog('professionRemove', obj);

    if (typeof obj === 'object' && obj !== null) {
        removeFromCharacter(oCharacter.profession, obj, 'profession', obj.details.id, obj.details.sub_id);
    } else {
        console.error("removeProfession: 'obj' is not a valid object: " + $.type(obj));
    }
}

/**
 * Upgrade a profession linked to the character.
 * @param {Object} obj - The profession object.
 */
function upgradeProfession(obj) {
    debugLog('professionUpgrade', obj);

    if (typeof obj === 'object' && obj !== null) {
        if (checkExperienceCost(obj.rank_1_cost)) {
            addProfession(obj);
        } else {
            showMessage('#choice-actions', 'error', oTranslations[language].not_enough_vp);
        }
    } else {
        console.error("upgradeProfession: 'obj' is not a valid object: " + $.type(obj));
    }
}

// Export functions
export {
    pickProfession,
    addProfession,
    chooseProfession,
    upgradeProfession,
    removeProfession,
}