import { language, icons, oCharacter, oTranslations } from './settings.js';
import { _construct, calculateSkillCost, calculateProfessionCost, checkXPCost, elementAdd, modalClear, modalSet, showMessage, skillAdd, professionAdd, updateCharacterStats } from './functions.js';

$(document).ready(function() {

    let oTempData;
    let formRules;

    _construct($('input[name="character"]').val());

    //add extra functionality to the model
    $('a[data-open]').on('click',function(){     
        var sAction = $(this).data("type");    
        modalClear();
        //--make call to fill the dropdown
        $.ajax({
            url: window.location.origin + '/action/get-dropdown',
            data: {
                action: `fill-dropdown-${sAction}`,
                character: oCharacter,
            },
            type: 'POST',
            dataType: 'json',
            success: function(data) {
                var optGroup = '';
                for(var i=0; i< data.length; i++) {
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
                    } else if(data[i].hasOwnProperty('type_name')) {
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
                    } else {
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
                $('#modal-loading').hide();
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
            url: window.location.origin + '/action/get-details',
            data: {
                id: iID,
                action: `get-details-${sAction}`
            },
            type: 'POST',
            dataType: 'json',
            success: function(data) {
                //console.log(data);
                oTempData = data;
                modalSet(data,sAction);
            },
            error: function(error) {
                alert('Error:', error);
            }
        });

    });

    $('a[data-action]').on('click', function(){
        //set several variables
        //--sAction; will be used to collect what action is being called by clicking on choice
        //--bCheck; will be used to check if the modal can be closed or should remain open
        var sAction = $(this).data("action");
        var $Container = sAction.replace('-choose','-list');
        var bCheck = false;        
        var showErrorMessage = (msg) => showMessage('p[choice-message]', 'error', `${oTranslations[language][msg]}`);
        //create a temporary object stripping it of all information we don't need
        var oChoice = {
            main_id: parseInt(oTempData.details.id),
            main_name: oTempData.details.name,
            sub_id: $('select[name="subtype"] option:selected').val() ? parseInt($('select[name="subtype"] option:selected').val()) : null,
            sub_name: ($('select[name="subtype"] option:selected').val() !== '') ? $('select[name="subtype"] option:selected').text() : null,
            modifier: oTempData.modifier,    
            xp_cost: parseInt(oTempData.details.xp_cost),            
        }

        var handleChoice = (addFunction,xpCalc) => {
            oChoice.xp_cost = xpCalc(oChoice);
            //check if xp is available
            if(!checkXPCost(oChoice.xp_cost)) {
                showErrorMessage('not_enough_vp');
            } else {
                if(oTempData.subtype.length > 0 && oChoice.sub_id === null) { 
                    showErrorMessage('choose_sub');                        
                } else {
                    addFunction(oChoice);
                    elementAdd($Container,oChoice);
                    //check if the choice has a stat modifier
                    if(oChoice.modifier.length > 0) {
                        updateCharacterStats();
                    }  
                    bCheck = true;
                }
            }
        }

        //perform an action based on what is being done
        switch(sAction) {
            case 'race-choose':
                var oRace = {
                    id: parseInt(oTempData.details.id),
                    //modifier: parseInt(),
                }
                $('#race').html(`<i class="fa-solid fa-rotate-right"></i>${oTempData.details.name}</span>`)
                oCharacter.race = oRace
                bCheck = true;
                break;
            case 'profession-choose':
                //set the xp cost of the object
                oChoice.rank = 1;
                handleChoice(professionAdd,calculateProfessionCost);
                break;
            case 'skill_base-choose':
            case 'skill_combat-choose':
            case 'skill_magic-choose':
                //set the xp cost of the object
                oChoice.rank = $('input[name="rank"]:checked').val() !== undefined ? parseInt($('input[name="rank"]:checked').val()) : null;
                handleChoice(skillAdd,calculateSkillCost);
                break;
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
            case 'item_add-choose':
                break;
            default:
                console.error(`a[data-action], unknown sAction called with value: ${sAction}`);
                break;
        }
        
        if(bCheck) {
            console.log(oCharacter);
            $('#selection-modal').foundation('close');
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