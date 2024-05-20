import { oSettings, oCharacter } from './settings.js';
import { checkXPCost, elementAdd, professionAdd } from './functions.js';

$(document).ready(function() {

    let oTempData;
    let formRules;

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
                //remove the old options
                $('select[name="type"] option').filter(function() {
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
                    //remove the old options
                    $('select[name="subtype"] option').filter(function() {
                        return $(this).attr('value') !== undefined && $(this).attr('value') !== "";
                    }).remove();
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
        var element = '';
        console.log(sAction);
        
        switch(sAction) {
            case 'race-choose':
                oCharacter.race.id = parseInt(oTempData.details.id);
                oCharacter.race.modifier = 1;
                bCheck = true;
                break;
            case 'profession-choose':
                var oProfession = {
                    main_id: parseInt(oTempData.details.id),
                    main_name: oTempData.details.name,
                    sub_id: parseInt($('select[name="subtype"] option:selected').val()),
                    sub_name: $('select[name="subtype"] option:selected').text(),
                    rank: 1,
                }
                var cost = parseInt(oSettings.arrProfLevel[oProfession.rank-1]);

                if(checkXPCost(cost)) {
                    professionAdd(oProfession);
                    elementAdd("profession-list",oProfession);                    
                    bCheck = true;
                } else {
                    
                }                
                break;
            case 'skill_base-choose':
            case 'skill_combat-choose':
            case 'skill_magic-choose':
                console.log(oTempData);
                var oSkill = {
                    main_id: parseInt(oTempData.details.id),
                    main_name: oTempData.details.name,
                    sub_id: parseInt($('select[name="subtype"] option:selected').val()),
                    sub_name: $('select[name="subtype"] option:selected').text(),
                    rank: null,

                }

                if(checkXPCost(cost)) {
                    professionAdd(oSkill);
                    elementAdd("profession-list",oProfession);                    
                    bCheck = true;
                } else {
                    
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