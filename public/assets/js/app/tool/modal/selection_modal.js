//Generic settings and functions
import { domain, icons, language, oTranslations } from '../settings.js';
import { debugLog, allowChoose } from '../functions.js'
import { convertCurrency } from '../currency.js';
import { chooseRace } from '../race.js'
import { chooseProfession } from '../professions.js';
import { chooseSkill } from '../skills.js';
import { chooseItem, chooseBasekit } from '../equipment.js';
import { clearModal, $typeSelect, $subtypeSelect, $rankSelect, $choice_image_container, $choice_image, $choice_description, $choice_details, $choice_actions, $modalLoading } from "./modal.js";

let oTmpData = {};
let oTmpSelector = null;

//basic function to open the modal
//requires a modal DOM element to target
//requires a action to be linked
function openSelectionModal(sAction,$modal) {
    debugLog('openSelectionModal:',sAction,$modal);
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
                allowChoose();
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
        oTmpData.current = {
            sub_id: $subtypeSelect.val(),
            sub_name: $subtypeSelect.text(),
        }
        allowChoose();
        updateModal(sAction,oTmpData); 
    });
    //-- changing of the rank input field
    $modal.find('input[name="rank"]').off('change').on('change',function() {
        const value = $(this).val();
        $('#rank_cost').text(calculateSkillCost(oTempData,value));
    });
}

//This function updates the modal image
//Checks the id and sub_id, uses different path which is available
function updateModal (sAction,oData) {
    debugLog('updateModal: ',sAction,oData);
    //update parts of the Modal
    if(sAction === 'profession' || sAction === 'race') {
        updateModalImage(sAction,oData);
    } else {
        updateModalImage();
    }    
    updateModelContent(oData.details);
    updateModelDetails(sAction,oData.details,oData.modifier);
    updateModelButtons(sAction,oData.details);
    //items allow amount to be chosen
    if(sAction == 'item') {
        $('[name="amount"]').show();
    } else {
        $('[name="amount"]').hide();
    }
}

/**
 * Updates the dropdown menu in a modal with new options.
 * @param {jQuery} $element - The jQuery object of the select element to update.
 * @param {Array} oData - An array of objects containing the data for the dropdown options.
 * Each object can contain properties like id, name, prof_name, or type_name.
 */
function updateModalDropdown($element, oData) {
    // Clear existing options to ensure a fresh start
    $element.empty();

    // Ensure oData is an array
    if (!Array.isArray(oData)) {
        console.error('Invalid data: oData should be an array.');
        return;
    }

    // Add a disabled initial option for user choice
    const initialOption = $('<option>', {
        value: '',
        text: oTranslations[language].choose_option,
        selected: true,
        disabled: true
    });
    $element.append(initialOption);

    // Variable to track current option group
    let currentGroup = '';

    // Populate the dropdown with options
    oData.forEach(item => {
        let option;
        if (item.prof_name || item.type_name) {
            const groupName = item.prof_name || item.type_name;
            if (currentGroup !== groupName) {
                const optionGroup = $('<optgroup>', { label: groupName });
                $element.append(optionGroup);
                currentGroup = groupName;
            }
            option = $('<option>', {
                value: item.id,
                text: item.name
            });
            $element.find(`optgroup[label="${groupName}"]`).append(option);
        } else {
            option = $('<option>', {
                value: item.id,
                text: item.name
            });
            $element.append(option);
        }
    });
}

/**
 * Updates the modal image based on the provided data.
 * 
 * This function sets the image's path and visibility depending on the presence of 
 * `id` and `sub_id` values within the provided data object.
 *
 * @param {Object} oData - The data object containing image details.
 * @param {Object} [oData.details] - The details object.
 * @param {number|string|null} [oData.details.id] - The ID for the image.
 * @param {Object} [oData.current] - The current object.
 * @param {number|string|null} [oData.current.sub_id] - The sub-ID for the image.
 */
function updateModalImage(sAction, oData) {
    const id = oData?.details?.id || null;
    const sub_id = oData?.current?.sub_id || null;

    // Determine the image source and visibility
    let src = '';
    if (id && sub_id) {
        src = `${domain}/assets/images/${sAction}/${sAction}_${id}_${sub_id}.jpg`;
    } else if (id) {
        src = `${domain}/assets/images/${sAction}/${sAction}_${id}.jpg`;
    }

    if (src) {
        $choice_image.attr('src', src);
        $choice_image_container.show();
    } else {
        $choice_image.attr('src', '');
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
            case 'item':
                contentDetailsElements.push($('<p>', { html: convertCurrency(price) }));
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
        oTmpSelector = sAction;
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
            case 'item':
                click_function = chooseItem;
                break;
            case 'race': 
                click_function = chooseRace;
            default:
                console.warn(`Unused action of ${sAction} has been called`);
                break;
        }

        // Prepare content actions elements
        const contentActionsElements = [];

        // Create and bind the button element if click_function is valid
        if (click_function) {
            const $button = $('<button>', {
                id: 'choose-characterAsset',
                class: 'button solid',
                html: `${icons.choose.icon} ${icons.choose.text}`,
                disabled: !allowChoose() //logic is reversed because of how disable attribute works                
            }).on('click', function(e) {
                e.preventDefault();
                click_function(sAction,oTmpData);
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

export {
    oTmpSelector,
    $subtypeSelect,
    $rankSelect,
    openSelectionModal,
    clearModal,
    updateModalDropdown
} 