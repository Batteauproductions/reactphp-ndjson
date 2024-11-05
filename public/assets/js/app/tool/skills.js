//Generic settings and functions
import { oCharacter } from './settings.js'
import { debugLog } from './functions.js'
import { openModal } from './modal.js'
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
    //define modal and form
    const $modal = $('#selection-modal')
    const $form = $('#background-form');
    openModal($modal,$form);
    //--set default status to loading
    $modalLoading.show();        
    //--make call to fill the dropdown
    $.ajax({
        url: `${domain}/action/get-dropdown`,
        data: {
            action: `fill-dropdown-${sAction}`,
            character: oCharacter,
        },
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            const $select = $('select[name="type"]');
            //allways add a disabled option to the dropdown so the user has to make a consious choice
            $select.append(`<option value selected disabled>${oTranslations[language].choose_option}</option>`)
            let optGroup = '';

            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                let optionGroup, option;

                if (item.hasOwnProperty('prof_name') || item.hasOwnProperty('type_name')) {
                    let groupName = item.prof_name || item.type_name;

                    if (optGroup === '' || optGroup !== groupName) {
                        optionGroup = $('<optgroup>', {
                            label: groupName
                        });
                        optGroup = groupName;
                        $select.append(optionGroup);
                    }

                    option = $('<option>', {
                        value: item.id,
                        text: item.name
                    });

                    $select.find('optgroup[label="' + groupName + '"]').append(option);
                } else {
                    option = $('<option>', {
                        value: item.id,
                        text: item.name
                    });
                    $select.append(option);
                }
            }
            //select the first option per default
            $('select[name="type"] option:first, select[name="subtype"] option:first').prop('selected', true);
            $select.data('name',sAction).show();
            $('div[data-id="modal-loading"]').hide();
            $('#modal-form').show();
        },
        error: function(error) {
            console.log('Error:', error);
        }
    });
}

function pickSkillProfession () {
    debugLog('pickSkillProfession');
    pickSkill('profession');
}
function pickSkillCombat () {
    debugLog('pickSkillCombat');
    pickSkill('combat');
}
function pickSkillMagic () {
    debugLog('pickSkillMagic');
    pickSkill('magic');
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