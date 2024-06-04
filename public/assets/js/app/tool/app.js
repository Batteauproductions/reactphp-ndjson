import { 
    domain
    ,icons
    ,oCharacter
    ,language
    ,oTranslations
} from './settings.js';

import {
    raceAdd,
    raceRemove,
} from './race.js'

import {
    professionAdd,
    professionRemove,
} from './professions.js'

import { 
    skillAdd, 
    skillRemove,
} from './skills.js';

import {
    itemAdd,
    itemRemove,
} from './items.js'

import { 
    _construct, 
    calculateSkillCost, 
    calculateProfessionCost, 
    handleChoice,
    modalClear,
    modalSet, 
    updateCharacter,
} from './functions.js';

$(document).ready(function() {

    let oTempData;
    let formRules;

    _construct($('input[name="character"]').val());

    //add extra functionality to the model
    $('a[data-open="adventure-modal"]').on('click', function() {
        const adventure_id = $(this).data('id');
        const $modalLoading = $('div[data-id="modal-loading"]');
        const $adventureForm = $('#adventure-form');
        const $textareas = $('textarea[id^="question_"]');
    
        $.ajax({
            url: `${domain}/action/get-adventure`,
            data: { id: adventure_id },
            type: 'POST',
            dataType: 'json',
            success: (data) => {
                if (data) {
                    console.warn('already adventure available');
                    $textareas.each(function(index) {
                        $(this).text(data[`question_${index + 1}`]);
                    });
                } else {
                    console.warn('no available adventures');
                }
                $modalLoading.hide();
                $adventureForm.show();
            },
            error: (error) => {
                console.log('Error:', error);
            }
        });
    });

    $('a[data-open="selection-modal"]').on('click',function(){     
        var sAction = $(this).data("type");    
        //--set default status to loading
        $('div[data-id="modal-loading"]').show();
        $('#modal-form').hide();    
        //--hide the elements in the reveal model
        modalClear(true);
        
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
                var select = $('select[name="type"]');
                select.append(`<option value selected disabled>${oTranslations[language].choose_option}</option>`)
                var optGroup = '';

                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    var optionGroup, option;

                    if (item.hasOwnProperty('prof_name') || item.hasOwnProperty('type_name')) {
                        var groupName = item.prof_name || item.type_name;

                        if (optGroup === '' || optGroup !== groupName) {
                            optionGroup = $('<optgroup>', {
                                label: groupName
                            });
                            optGroup = groupName;
                            select.append(optionGroup);
                        }

                        option = $('<option>', {
                            value: item.id,
                            text: item.name
                        });

                        select.find('optgroup[label="' + groupName + '"]').append(option);
                    } else {
                        option = $('<option>', {
                            value: item.id,
                            text: item.name
                        });

                        select.append(option);
                    }
                }
                //select the first option per default
                $('select[name="type"] option:first, select[name="subtype"] option:first').prop('selected', true);
                $('select[name="type"]').data('name',sAction).show();
                $('div[data-id="modal-loading"]').hide();
                $('#modal-form').show();
            },
            error: function(error) {
                console.log('Error:', error);
            }
        });

    });
    
    $('body').on('change','input[name="rank"]',function(){
        let value = $(this).val();
        $('#rank_cost').text(calculateSkillCost(oTempData,value));
    });

    $('select[name="type"]').on('change',function(){
        modalClear();
        //collect data
        var iID = $(this).val();
        var sAction = $(this).data("name");
        //make call to collect details
        $.ajax({
            url: `${domain}/action/get-details`,
            data: {
                id: iID,
                action: `get-details-${sAction}`
            },
            type: 'POST',
            dataType: 'json',
            success: function(data) {
                console.log(data);
                oTempData = data;
                modalSet(data,sAction);
            },
            error: function(error) {
                alert('Error:', error);
            }
        });

    });

    $('body').on('click', 'a[data-action]', function(){
        $('p.input-message').remove();
        //--sAction; will be used to collect what action is being called by clicking on choice
        const sAction = $(this).data("action");
        
        //perform an action based on what is being done
        switch(sAction) {
            case 'base_kit-choose':
                var $element = $('div[data-id="base_kit-list"]');
                oCharacter.build.base_kit = parseInt(oTempData.details.id);
                var container = $('<div>', {
                    html: `<h3 data-title>${oTempData.details.name}</h3><p data-description>${oTempData.details.description}</p>`
                });
                var icon = icons["change"];
                $('a[data-type="base_kit"]').html(`${icon.icon} ${icon.text}`);
                $element.empty().append(container);
                updateCharacter();
                $('#selection-modal').foundation('close');
                break;
            case 'item-remove':
                itemRemove($(this),$(this).data('id'),$(this).data('sub_id'));
                break;
            case 'item_add-choose':
                oTempData.amount = ($('input[name="item_amount"]').val() !== '') ? parseInt($('input[name="item_amount"]').val()) : null;
                oTempData.cost = parseInt(oTempData.details.price);
                handleChoice(oTempData,itemAdd,sAction,'item');
                break;
            case 'profession-choose':
                oTempData.rank = 1;
                oTempData.cost = calculateProfessionCost(oTempData, oTempData.rank);
                handleChoice(oTempData,professionAdd,sAction,'profession');
                break;
            case 'profession-remove':
                professionRemove($(this),$(this).data('id'),$(this).data('sub_id'));
                break;
            case 'race-choose':
                raceAdd(oTempData);                
                break;
            case 'skill_base-choose':
            case 'skill_combat-choose':
            case 'skill_magic-choose':
                oTempData.rank = $('input[name="rank"]:checked').val() !== undefined ? parseInt($('input[name="rank"]:checked').val()) : null;
                oTempData.cost = calculateSkillCost(oTempData, oTempData.rank);
                handleChoice(oTempData,skillAdd,sAction,'skill');
                break;
            case 'skill-remove':
                skillRemove($(this),$(this).data('id'),$(this).data('sub_id'));
                break;
            default:
                console.error(`a[data-action], unknown sAction called with value: ${sAction}`);
                break;
        }
    });

    //form validatior
    $("#update-character").validate({
        rules: formRules
        ,errorClass: 'input-error'
        ,errorPlacement: function (error, element) {
            error.insertAfter(element);
        }
        ,submitHandler: function(form) {
            $('button[type="submit"]').attr('disabled',true);
            form.submit();
        }
    });
    
});