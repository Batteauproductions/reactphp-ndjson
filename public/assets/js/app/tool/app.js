import { oSettings, oCharacter } from './settings.js';
import { _construct, calculateProfessionCost, checkXPCost, elementAdd, showMessage, skillAdd, professionAdd } from './functions.js';

$(document).ready(function() {

    let oTempData;
    let formRules;

    _construct($('input[name="character"]').val());

    //add extra functionality to the model
    $('a[data-open]').on('click',function(){ 
        var sAction = $(this).data("type");
        //hide the elements in the reveal model
        $('select[name="type"]').hide();
        $('select[name="subtype"]').hide();
        $(`#description`).hide();
        //make call to fill the dropdown
        $.ajax({
            url: window.location.origin + '/action/get-dropdown',
            data: {
                action: `fill-dropdown-${sAction}`,
                character: oCharacter,
            },
            type: 'POST',
            dataType: 'json',
            success: function(data) {
                //console.log(data);
                //remove the old types /remove the old sub types
                $('select[name="type"] option, select[name="subtype"] option').filter(function() {
                    return $(this).attr('value') !== undefined && $(this).attr('value') !== "";
                }).remove();
                //add options to the dropdown                
                for(var i=0; i< data.length; i++) {
                    var option = $('<option>', {
                        value: data[i].id,
                        text: data[i].name
                    });
                    $('select[name="type"]').append(option);
                }
                //select the first option per default
                $('select[name="type"] option:first, select[name="subtype"] option:first').prop('selected', true);
                $('select[name="type"]').data('name',sAction).show();
            },
            error: function(error) {
                console.log('Error:', error);
            }
        });

    });
    
    $('select[name="type"]').on('change',function(){
        //hide the dropdown with subtypes
        $('select[name="subtype"]').hide();
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
                //check if the data has a subtype                
                if (data.hasOwnProperty('subtype') && data.subtype.length > 0) {
                    
                    //add new options
                    for(var i=0; i< data.subtype.length; i++) {
                        var option = $('<option>', {
                            value: data.subtype[i].id,
                            text: data.subtype[i].name
                        });
                        $('select[name="subtype"]').append(option);
                    }
                    $('select[name="subtype"]').show();
                };
                //fill the content                
                $(`#description h1[data-title]`).html(data.details.name);
                $(`#description p[data-description]`).html(data.details.description);
                $(`a[data-action]`).data('action',`${sAction}-choose`);
                $(`#description a[data-link]`).attr('href',`https://larp.dalaria.nl/wp-content/uploads/documents/KvD-Basisregels.pdf#page=${data.details.rule_page}`);
                $(`#description`).show();
            },
            error: function(error) {
                alert('Error:', error);
            }
        });

    });

    $('a[data-action]').on('click', function(){
        var sAction = $(this).data("action");
        var bCheck = false;

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
                //define a custom profession object
                var oProfession = {
                    main_id: parseInt(oTempData.details.id),
                    main_name: oTempData.details.name,
                    sub_id: parseInt($('select[name="subtype"] option:selected').val()),
                    sub_name: ($('select[name="subtype"] option:selected').text() !== 'Geen voorkeur') ? $('select[name="subtype"] option:selected').text() : null,
                    rank: 1,                    
                }
                oProfession.xp_cost = calculateProfessionCost(oProfession.rank);
                //check if xp is available
                if(checkXPCost(parseInt(oSettings.arrProfLevel[oProfession.rank-1]))) {
                    professionAdd(oProfession);
                    elementAdd("profession-list",oProfession);                    
                    bCheck = true;
                } else {
                    showMessage('error','Je hebt niet genoeg vaardigheidspunten.'); 
                }                
                break;
            case 'skill_base-choose':
            case 'skill_combat-choose':
            case 'skill_magic-choose':
                //define a custom skill object
                var oSkill = {
                    main_id: parseInt(oTempData.details.id),
                    main_name: (oTempData.details.name !== 'Geen voorkeur') ? oTempData.details.name : null,
                    sub_id: parseInt($('select[name="subtype"] option:selected').val()),
                    sub_name: ($('select[name="subtype"] option:selected').text() !== 'Geen voorkeur') ? $('select[name="subtype"] option:selected').text() : null,
                    rank: null,
                }
                //check if xp is available
                if(checkXPCost(parseInt(oTempData.details.xp_cost))) {
                    skillAdd(oSkill);
                    elementAdd("skill_base-list",oSkill);                    
                    bCheck = true;
                } else {
                    showMessage('error','Je hebt niet genoeg vaardigheidspunten.');
                }  

                break;
            default:
                console.error(`a[data-action], unknown sAction called with value: ${sAction}`);
                break;
        }
        console.log(oCharacter)
        if(bCheck) {
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