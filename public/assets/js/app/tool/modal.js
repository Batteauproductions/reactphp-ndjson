import { 
    domain
    ,icons
    ,oCharacter
    ,language
    ,oTranslations
} from './settings.js';

const $modalLoading = $('div[data-id="modal-loading"]');

//basic function to open the modal
//requires a modal DOM element to target
//requires a form to be cleared
function openModal($modal,$form,sAction){
    $modalLoading.show();
    $form.empty().hide();  
    $modal.foundation('open');

    $($modal).off('change').on('change','input[name="rank"]',function(){
        const value = $(this).val();
        $('#rank_cost').text(calculateSkillCost(oTempData,value));
    });

    //Handles the functionality of change the main type of profession, skill or item and returns the corresponding data subset
    $(`${$modal} select[name="type"]`).off('change').on('change',function(){
        modalClear();
        //collect data
        const iID = $(this).val();
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
                //console.log(data);
                oTempData = data;
                modalSet(data,sAction);
            },
            error: function(error) {
                alert('Error:', error);
            }
        });
    });

    //Makes sure that the image changes the moment a nu sub type is chosen
    $(`${$modal} select[name="subtype"]`).off('change').on('change',function(){
        //sets the fields
        const $image = $('#choice-image');
        const $type = $('select[name="type"]');
        const $subtype = $('select[name="subtype"]');
        //--collects the values
        const typeValue = $type.val();
        const typeName = $type.data('name');
        const subtypeValue = $subtype.val();
        //--update the image based on type name
        // currently only professions support sub-images
        switch(typeName) {
            case 'profession':
                $image.attr('src',`${domain}/assets/images/profession/prof_${typeValue}_${subtypeValue}.png`).show();
                break;
            default:
                $image.attr('src','').hide();
                break;
        }
    });
}

//This function opens the plain text modal
//This function is used for the following actions
//--character name
function openTextModal(sAction) {
    const $modal = $('#text-modal')
    const $form = $('#text-form');
    openModal($modal,$form,sAction);
    //container of elements to be place within the modal
    let contentElements = [];
    //switch the content of the modal based on action
    switch(sAction) {
        case 'name':
            contentElements.push($('<label>', { 
                for: 'character-name', 
                text: oTranslations[language].character_name 
            }));
            contentElements.push($('<input>', { 
                id: 'character-name', 
                name: 'character-name', 
                type: 'text',
                value: oCharacter.meta.name ? oCharacter.meta.name : ''
            }));
            contentElements.push($('<a>', { 
                class: 'button solid','data-action': `${sAction}-choose`,
                html: `${icons.choose.icon} ${icons.choose.text}`
            }));
            $modalLoading.hide();
            $form.append(contentElements).show();
            break;
        default:
            console.warn(`a[data-open="text-modal"], unknown sAction called with value: ${sAction}`);
            break;
    }
}

//This function opens the modal for the submission of stories
//This function is used for the following actions
//--writing the background
//--writing adventures
function openStoryModal(sAction) {
    const $modal = $('#background-modal')
    const $form = $('#background-form');
    openModal($modal,$form,sAction);
    switch(sAction) {
        case 'adventure':
            const adventure_id = $(this).data('id');
            const $Form = $('#adventure-form');
            const $textareas = $('textarea[id^="question_"]');
            
            //--set default status to loading
            $modalLoading.show();        
            $Form.hide();  

            //--make call to fill the dropdown
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
                    $Form.show();
                },
                error: (error) => {
                    console.log('Error:', error);
                }
            });
            break;
        default:
            break;
    }
}

function openProfessionModal () {

}

function openSkillModal(sAction) {
    const sAction = $(this).data("type");    
    const $Form = $('#background-form');   
    
    //--set default status to loading
    $modalLoading.show();        
    $Form.hide();    

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

export {
    openTextModal,
    openStoryModal,
    openProfessionModal,
    openSkillModal,
} 