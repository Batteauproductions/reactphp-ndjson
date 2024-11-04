import { 
    domain
    ,icons
    ,oCharacter
    ,language
    ,oTranslations
} from './settings.js';

const $modalLoading = $('div[data-id="modal-loading"]');
const $typeSelect = $('select[name="type"]');
const $typeAmount = $('[name="amount"]');
const $subtypeSelect = $('select[name="subtype"]');
const $choice_image = $('#choice-image');
const $choice_description = $('#choice-description');
const $choice_details = $('#choice-details');
const $choice_actions = $('#choice-actions');

/*clearModal
--complete, weither the modal should be completely cleared
*/
function clearModal(complete=false) {
    // Clear previous content
    if(complete) {
        $typeSelect.empty().hide();
        $typeAmount.val('1').hide();
    } else {
        $form.empty().hide(); 
    }
    $choice_image.attr('src','').hide();
    $subtypeSelect.empty().hide();
    $choice_description.empty().hide();
    $choice_details.empty().hide();
    $choice_actions.empty().hide();     
    $modal.foundation('open');
}

//basic function to open the modal
//requires a modal DOM element to target
//requires a form to be cleared
function openModal($modal,$form,sAction){
    $modalLoading.show();
    clearModal($modal,$form);
    //Bind functions to the elements within the modal
    //-- changing of the rank input field
    $($modal).off('change').on('change','input[name="rank"]',function(){
        const value = $(this).val();
        $('#rank_cost').text(calculateSkillCost(oTempData,value));
    });
    //-- changing of the 'type' select option values
    $(`${$modal} select[name="type"]`).off('change').on('change',function(){
        clearModal();
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
    //-- changing of the 'subtype' select option values
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

function buildModal(data, action) {

    clearModal();

    // Check if the data has a subtype, otherwise add new options
    if (data.subtype && data.subtype.length > 0) {
        const options = data.subtype.map(subtype => $('<option>', {
            value: subtype.id,
            text: subtype.name
        }));
        $subtypeSelect.append(options).show();
    }

    //items allow amount to be chosen
    if(action == 'item_add') {
        $('[name="amount"]').show();
    } else {
        $('[name="amount"]').hide();
    }

    // Create and append content elements if they exist
    //Always check if the attribute is set, if not do not add to the model

    /*-- update the image --*/
    let subtypeValue = $('[name="subtype"]').val();
    if(action === "profession") {
        if (data.details.id && subtypeValue) {
            $choice_image.attr('src',`${domain}/assets/images/profession/prof_${data.details.id}_${subtypeValue}.png`).show();
        } else if (data.details.id) {
            $choice_image.attr('src',`${domain}/assets/images/profession/prof_${data.details.id}.png`).show();
        }    
    }

    /*--contentElements-- */
    //The base description of the race, profession or skill
    const contentElements = [];
    if (data.details.name) {
        contentElements.push($('<h1>', { html: data.details.name }));
    }
    if (data.details.description) {
        contentElements.push($('<p>', { html: data.details.description }));
    }
    if (data.details.advanced_description) {
        contentElements.push($('<p>', { html: data.details.advanced_description }));
    }       
    $choice_description.append(contentElements).show();

    /* --contentDetailsElements-- */
    //Extra information (shown in box) of the race, profession or skill
    const contentDetailsElements = [];
    if (data.details.disclaimer) {  
        const disclaimer = data.details.disclaimer;
        if(disclaimer.includes('|')) {
            const arrDisclaimer = disclaimer.split('|'); 
            for (let i = 0; i < arrDisclaimer.length; i++) {
                contentDetailsElements.push($('<p>', { class: `${icons.disclaimer.class}`, html: `${icons.disclaimer.icon} ${arrDisclaimer[i]}` }));
            }
        } else {
            contentDetailsElements.push($('<p>', { html: `${icons.disclaimer.icon} ${disclaimer}` }));
        }  
    } 
    if (data.details.requirement_name) {        
        contentDetailsElements.push($('<p>', { html: `${icons.required.icon} ${data.details.requirement_name}` }));
    } 
    if (data.details.loresheet) {        
        contentDetailsElements.push($('<p>', { html: `${icons.loresheet.icon} ${icons.loresheet.text}` }));
    }   
    //if the choice has a option of modifier, give the option to choose, otherwise just show 
    if(data.modifier && data.modifier.length > 1) {        
        for(let i = 0; i < data.modifier.length; i++) {
            var name = data.modifier[i].name;
            var row = $('<div>', { class: `choice-row` });
            var input = $('<input>', { id: `modifier-${i}`, value: data.modifier[i].id, type: 'radio', name: 'stat-modifier' });
            var label = $('<label>', { for: `modifier-${i}`, html: `${icons[name.toLowerCase()].icon} ${icons[name.toLowerCase()].text}` });
            row.append(input, label);
            contentDetailsElements.push(row);
        }        
    } else if (data.modifier && data.modifier.length == 1) {
        var name = data.modifier[0].name;
        contentDetailsElements.push($('<p>', { html: `${icons[name.toLowerCase()].icon} ${icons[name.toLowerCase()].text}` }));
    }
    //if the choice has ranks to choice, give the option to choose the rank
    if (data.details.max_rank) {
        var $row = $('<div>', { html: `${icons.rank.icon}` })
        for (let i = 1; i <= data.details.max_rank; i++) {
            $row.append(
                $('<input>', { id: `rank-${i}`, value: i, type: 'radio', name: 'rank' })
                ,$('<label>', { for: `rank-${i}`, text: ` ${i}` })
            );
        }
        contentDetailsElements.push($row)
    }

    //split based on action, shows in the contentDetailsElements container
    let click_function = {};
    switch (action) {
        case 'skill_base':
        case 'skill_combat':
        case 'skill_magic':
            contentDetailsElements.push($('<p>', { html: `${icons.experience.icon} <span id="rank_cost">${data.details.xp_cost}</span> ${icons.experience.text}`}));
            break;
        case 'profession':
            click_function = chooseProfession;
            contentDetailsElements.push($('<p>', { html: `${icons.experience.icon} ${data.details.rank_1_cost} ${icons.experience.text}`}));
            break;
        case 'item_add':
            contentDetailsElements.push($('<p>', { html: currencyConvert(data.details.price) }));
            break;
        default: 
            console.warn(`Unused action of ${action} has been called`);
            break;
    }

    //--choice skills
    if (data.skills && data.skills.length > 1) {
        data.skills.forEach(skill => {
            //Declare variables
            const { main_id, main_name, sub_id, sub_name, options } = skill;
            const row = $('<div>', { 'data-raceskill': '', class: 'choice-row' });
            // Check if the skills has options
            if (options) {
                //Create DOM elements
                const $label = $('<label>', { text: main_name, for: 'subtype-dropdown' });
                const $select = $('<select>', { id: 'subtype-dropdown' });
                // Iterate over the object to create <option> elements
                $.each(options, (key, value) => {
                    const $option = $('<option>', {
                        value: value.id,
                        text: value.name
                    });
                    // Append the option to the select element
                    $select.append($option);
                });
                row.append($label, $select);
            } else {
                row.html(`<p>${main_name} - ${sub_name}</p>`);
                skill.race = true;
                choice_skills.push(skill);
            }
            contentDetailsElements.push(row);
        });

    }
    
    //if there are details, show them on the page
    if(contentDetailsElements.length > 0) {
        $choice_details.append(contentDetailsElements).show();
    }
        
    /*--contentActionsElements-- */
    const contentActionsElements = [];
    // Create the button element
    let $button = $('<a>', {
        class: 'button solid',
        html: `${icons.choose.icon} ${icons.choose.text}`
    });
    // Bind the click event to the button
    $button.on('click', click_function);
    // Add the button to the contentActionsElements array
    contentActionsElements.push($button);

    if (data.details.rule_page) {
        contentActionsElements.push($('<a>', { 
            class: 'button clear'
            ,target: '_blank'
            ,href: `https://larp.dalaria.nl/wp-content/uploads/documents/KvD-Basisregels.pdf#page=${data.details.rule_page}`
            ,html: `${icons.more_info.icon} ${icons.more_info.text}`})
        );
    }
    $choice_actions.append(contentActionsElements).show();;

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
    clearModal(true);
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
    clearModal,
    openTextModal,
    openStoryModal,
    openProfessionModal,
    openSkillModal,
} 