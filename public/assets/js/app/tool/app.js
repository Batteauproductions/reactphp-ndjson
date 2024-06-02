import { 
    domain
    ,icons
    ,oCharacter
} from './settings.js';

import { 
    skillAdd, 
    skillRemove,
} from './skills.js';

import {
    professionAdd,
    professionRemove,
} from './professions.js'

import {
    itemAdd,
    itemRemove,
} from './items.js'

import { 
    _construct, 
    calculateSkillCost, 
    calculateProfessionCost, 
    handleChoice,
    modalSet, 
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
        $('select[name="type"]').hide();
        $('select[name="subtype"]').hide();
        $('#choice-description').empty();
        //--remove the old types / remove the old sub types
        $('select[name="type"] option, select[name="subtype"] option').filter(function() {
            return $(this).attr('value') !== undefined && $(this).attr('value') !== "";
        }).remove();
        $('select[name="type"]').find('optgroup').remove();
        $('#rank-options').empty();        
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
                var optGroup = '';
                for(var i=0; i< data.length; i++) {
                    //check if we are dealing with skills, since they have a prof_name
                    if(data[i].hasOwnProperty('prof_name')) {
                        if(optGroup == '' || optGroup !== data[i].prof_name) {
                            var optionGroup = $('<optgroup>', {
                                label: data[i].prof_name
                            });
                            optGroup = data[i].prof_name;  
                        } 
                        if(optGroup == data[i].prof_name) {
                            var option = $('<option>', {
                                value: data[i].id,
                                text: data[i].name
                            });
                            optionGroup.append(option);       
                        } 
                        $('select[name="type"]').append(optionGroup);
                    } 
                    //or if we are dealing with items, since they have a type_name but not a prof_name
                    else if(data[i].hasOwnProperty('type_name')) {
                        if(optGroup == '' || optGroup !== data[i].type_name) {
                            var optionGroup = $('<optgroup>', {
                                label: data[i].type_name
                            });
                            optGroup = data[i].type_name;  
                        } 
                        if(optGroup == data[i].type_name) {
                            var option = $('<option>', {
                                value: data[i].id,
                                text: data[i].name
                            });
                            optionGroup.append(option);       
                        } 
                        $('select[name="type"]').append(optionGroup);
                    } 
                    //or something else (race/profession/basekit), since they have nothing like above
                    else {
                        var option = $('<option>', {
                            value: data[i].id,
                            text: data[i].name
                        });
                        $('select[name="type"]').append(option); 
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
    
    $('select[name="type"]').on('change',function(){
        //hide the dropdown with subtypes
        $('select[name="subtype"]').hide();
        $('#rank-options').html('');
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
                $element.html('').append(container)
                bCheck = true;
                break;
            case 'item-remove':
                itemRemove($(this),$(this).data('id'),$(this).data('sub_id'));
                break;
            case 'item_add-choose':
                oTempData.amount = ($('input[name="item_amount"]').val() !== '') ? parseInt($('input[item_amount"]').val()) : null;
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
                var oRace = {
                    id: parseInt(oTempData.details.id),
                    //modifier: parseInt(),
                }
                $('#race').html(`<i class="fa-solid fa-rotate-right"></i>${oTempData.details.name}</span>`)
                oCharacter.race = oRace
                bCheck = true;
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