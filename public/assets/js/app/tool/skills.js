//Generic settings and functions
import { domain, oCharacter, language, oTranslations } from './settings.js'
import { debugLog, checkXPCost, showMessage } from './functions.js'
import { openModal, updateModalDropdown } from './modal.js'
//Functions needed for actual app performance
import { addToCharacter, removeFromCharacter } from './character.js';

function chooseSkill() {
    oTempData.rank = $('input[name="rank"]:checked').val() !== undefined ? parseInt($('input[name="rank"]:checked').val()) : null;
    oTempData.cost = calculateSkillCost(oTempData, oTempData.rank);
    handleChoice(oTempData,sAction,'skill');
}

//These functions deal with adding, altering or removing skills from the character
//obj: The skill that is being parsed
function addSkill(obj) {
    debugLog('addSkill', obj);
    if (typeof obj === 'object') {
        addToCharacter(oCharacter.skills,'skill',obj)
    } else {
        console.error("skillAdd is not an object: " +$.type(obj));
    }
}

function pickSkill(sAction) {
    debugLog('pickSkill');
    // Define modal and form
    const $modal = $('#selection-modal');
    const $form = $('#modal-form');

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
            debugLog('pickSkill[data]', data);
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

function pickSkillProfession () {
    debugLog('pickSkillProfession');
    pickSkill('skill_base');
}
function pickSkillCombat () {
    debugLog('pickSkillCombat');
    pickSkill('skill_combat');
}
function pickSkillMagic () {
    debugLog('pickSkillMagic');
    pickSkill('skill_magic');
}



//This function will remove a skill from the character
//obj: The skill that is being parsed
function removeSkill(element,main_id,sub_id) {
    removeFromCharacter(oCharacter.skills,element,'skill',main_id,sub_id)
}

export {  
    addSkill,
    chooseSkill,
    pickSkillProfession,
    pickSkillCombat,
    pickSkillMagic,
    removeSkill, 
}