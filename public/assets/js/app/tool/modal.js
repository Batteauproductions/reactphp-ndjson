//Generic settings and functions
import { domain, icons, oCharacter, language, oTranslations } from './settings.js';
import { debugLog } from './functions.js'
//Page functions
import { chooseProfession } from './professions.js';
import { chooseSkill } from './skills.js';
import { chooseItem, chooseBasekit } from './equipment.js';

// Static DOM Elements
const $typeSelect = $('select[name="type"]');
const $subtypeSelect = $('select[name="subtype"]');
const $modalLoading = $('div[data-id="modal-loading"]');
const $typeAmount = $('[name="amount"]');
const $choice_image_container = $('#choice-image-container');
const $choice_image = $('#choice-image');
const $choice_description = $('#choice-description');
const $choice_details = $('#choice-details');
const $choice_actions = $('#choice-actions');

let oTmpData = {};

/*clearModal
--bClear, weither the modal should be completely cleared
*/
function clearModal(bClear) {
    oTmpData = {};
    if(bClear) {
        $typeSelect.empty().hide();
        $typeAmount.val('1').hide();
    }    
    updateModalImage(); 
    $subtypeSelect.empty().hide();
    $choice_description.empty().hide();
    $choice_details.empty().hide();
    $choice_actions.empty().hide();
}

//basic function to open the modal
//requires a modal DOM element to target
//requires a action to be linked
function openModal(sAction,$modal) {
    debugLog('openModal:',sAction,$modal);
    //default open state for the modal
    clearModal(true);
    $modalLoading.show();      
    $modal.foundation('open');
    //Bind functions to the elements within the modal    
    //-- changing of the 'type/subtype' select option values
    $modal.find('select[name="type"]').off('change').on('change',function() {
        clearModal();        
        //make call to collect details
        $.ajax({
            url: `${domain}/action/get-details`,
            data: {
                id: $typeSelect.val(),
                action: `get-details-${sAction}`
            },
            type: 'POST',
            dataType: 'json',
            success: function(oData) {
                debugLog('select[name="type"][data]',oData);
                oTmpData = oData;
                if (oTmpData.subtype && oTmpData.subtype.length > 0) {
                    updateModalDropdown($subtypeSelect, oTmpData.subtype);
                    $subtypeSelect.show();
                } else {
                    $subtypeSelect.hide();
                }
                updateModal(sAction,oTmpData);
            },
            error: function(error) {
                console.error(error);
            }
        });
    });
    $modal.find('select[name="subtype"]').off('change').on('change',function() {
        oTmpData.details.sub_id = $subtypeSelect.val(); 
        oTmpData.details.sub_name = $subtypeSelect.text();
        updateModalImage(oTmpData.details);
    });
    //-- changing of the rank input field
    $modal.off('change').on('change','input[name="rank"]',function() {
        const value = $(this).val();
        $('#rank_cost').text(calculateSkillCost(oTempData,value));
    });
}

//This function updates the modal image
//Checks the id and sub_id, uses different path which is available
function updateModal (sAction,oData) {
    debugLog('updateModal: ',sAction,oData);
    //update parts of the Modal
    updateModalImage(oData.details);
    updateModelContent(oData.details);
    updateModelDetails(sAction,oData.details,oData.modifier);
    updateModelButtons(sAction,oData.details);
    //items allow amount to be chosen
    if(sAction == 'item') {
        $('[name="amount"]').show();
    } else {
        $('[name="amount"]').hide();
    }
/*
    //--choice skills
    if (oData.skills && oData.skills.length > 1) {
        oData.skills.forEach(skill => {
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
    
    */
    
}

function updateModalDropdown($element, oData) {
    // Clear existing options to ensure a fresh start
    $element.empty();

    // Ensure oData is an array
    if (!Array.isArray(oData)) {
        console.error('Invalid data: oData should be an array.');
        return;
    }

    // Add a disabled option to ensure a conscious choice by the user
    const initialOption = $('<option>', {
        value: '',
        text: oTranslations[language].choose_option,
        selected: true,
        disabled: true
    });

    // Append the initial option directly to the select element
    $element.append(initialOption);

    // Populate the dropdown with options and append them directly
    oData.forEach(item => {
        $('<option>', {
            value: item.id,
            text: item.name
        }).appendTo($element);
    });

    /*
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
    */
}

function updateModalImage(oDetails) {
    if(oDetails) {
        //destructures the parameter
        const { id, sub_id } = oDetails;
        //sets up the path and visibility of the image
        if (id && sub_id) {
            $choice_image.attr('src',`${domain}/assets/images/profession/prof_${id}_${sub_id}.png`);
            $choice_image_container.show();
        } else if (id) {
            $choice_image.attr('src',`${domain}/assets/images/profession/prof_${id}.png`);
            $choice_image_container.show();
        }
    } else {
        $choice_image.attr('src',``);
        $choice_image_container.hide();
    }
}

function updateModelContent(oDetails) {
    // Check if oDetails is valid
    if (oDetails) {
        // Destructure the parameter with default values
        const {
            id_name = '',
            description = '',
            advanced_description = ''
        } = oDetails;

        // Array for batch DOM adding
        const contentElements = [];

        // Create and push content elements only if they have content
        if (id_name) {
            contentElements.push($('<h1>', { text: id_name }));
        }
        if (description) {
            contentElements.push($('<article>', { html: description }));
        }
        if (advanced_description) {
            contentElements.push($('<article>', { html: advanced_description }));
        }

        // Clear existing content and append new content elements
        $choice_description.empty().append(contentElements).show();
    } else {
        // Hide the description if no details are provided
        $choice_description.hide();
    }
}

function updateModelDetails(sAction, oDetails = {}, arrModifier = []) {
    // Check if action and details are valid or if there's a modifier
    if ((sAction && oDetails) || arrModifier.length > 0) {
        // Destructure parameters with defaults
        const {
            disclaimer = "",
            requirement_name = "",
            loresheet = "",
            max_rank = 0,
            xp_cost = "",
            rank_1_cost = "",
            price = ""
        } = oDetails;

        // Array for batch DOM adding
        const contentDetailsElements = [];
        // Cost-related text to the element
        switch (sAction) {
            case 'skill_base':
            case 'skill_combat':
            case 'skill_magic':
                contentDetailsElements.push($('<p>', { html: `${icons.experience.icon} <span id="rank_cost">${xp_cost}</span> ${icons.experience.text}` }));
                break;
            case 'profession':
                contentDetailsElements.push($('<p>', { html: `${icons.experience.icon} ${rank_1_cost} ${icons.experience.text}` }));
                break;
            case 'item_add':
                contentDetailsElements.push($('<p>', { html: currencyConvert(price) }));
                break;
            default:
                console.warn(`Unused action of ${sAction} has been called`);
                break;
        }
        // Add disclaimer paragraphs
        if (disclaimer) {
            const arrDisclaimer = disclaimer.split('|');
            arrDisclaimer.forEach(text => {
                contentDetailsElements.push($('<p>', { class: `${icons.disclaimer.class}`, html: `${icons.disclaimer.icon} ${text}` }));
            });
        }
        // Add requirement name
        if (requirement_name) {
            contentDetailsElements.push($('<p>', { html: `${icons.required.icon} ${requirement_name}` }));
        }
        // Add loresheet
        if (loresheet) {
            contentDetailsElements.push($('<p>', { html: `${icons.loresheet.icon} ${icons.loresheet.text}` }));
        }
        // Handle modifiers
        if (arrModifier.length > 0) {
            arrModifier.forEach((mod, i) => {
                const name = mod.name.toLowerCase();
                const iconHtml = `${icons[name].icon} ${icons[name].text}`;
                if (arrModifier.length > 1) {
                    const row = $('<div>', { class: 'choice-row' });
                    const input = $('<input>', { id: `modifier-${i}`, value: mod.id, type: 'radio', name: 'stat-modifier' });
                    const label = $('<label>', { for: `modifier-${i}`, html: iconHtml });
                    row.append(input, label);
                    contentDetailsElements.push(row);
                } else {
                    contentDetailsElements.push($('<p>', { html: iconHtml }));
                }
            });
        }
        // Handle ranks
        if (max_rank > 0) {
            const $row = $('<div>', { html: `${icons.rank.icon}` });
            for (let i = 1; i <= max_rank; i++) {
                $row.append(
                    $('<input>', { id: `rank-${i}`, value: i, type: 'radio', name: 'rank' }),
                    $('<label>', { for: `rank-${i}`, text: ` ${i}` })
                );
            }
            contentDetailsElements.push($row);
        }
        // Append all elements to the DOM in one go
        $choice_details.empty().append(contentDetailsElements).show();
    } else {
        $choice_details.hide();
    }
}

function updateModelButtons(sAction, oDetails) {
    if (sAction && oDetails) {
        const { rule_page } = oDetails;
        let click_function = null;

        // Determine the click function based on the action
        switch (sAction) {
            case 'skill_base':
            case 'skill_combat':
            case 'skill_magic':
                click_function = chooseSkill;
                break;
            case 'profession':
                click_function = chooseProfession;
                break;
            case 'item_add':
                click_function = chooseItem;
                break;
            default:
                console.warn(`Unused action of ${sAction} has been called`);
                break;
        }

        // Prepare content actions elements
        const contentActionsElements = [];

        // Create and bind the button element if click_function is valid
        if (click_function) {
            const $button = $('<a>', {
                class: 'button solid',
                html: `${icons.choose.icon} ${icons.choose.text}`
            }).on('click', function() {
                click_function(oTmpData);
            });
            contentActionsElements.push($button);
        }

        // Add a link to the rule page if available
        if (rule_page) {
            const rulePageLink = $('<a>', {
                class: 'button clear',
                target: '_blank',
                href: `https://larp.dalaria.nl/wp-content/uploads/documents/KvD-Basisregels.pdf#page=${rule_page}`,
                html: `${icons.more_info.icon} ${icons.more_info.text}`
            });
            contentActionsElements.push(rulePageLink);
        }

        // Append elements to the DOM and show
        $choice_actions.empty().append(contentActionsElements).show();
    } else {
        $choice_actions.hide();
    }
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

export {
    openModal,
    clearModal,
    openTextModal,
    openStoryModal,
    updateModalDropdown
} 