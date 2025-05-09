//Generic settings and functions
import { domain, icons, language, oTranslations } from '../settings.js';
import { allowChoose } from '../functions.js';
import { convertCurrency } from '../currency.js';
import { chooseRace } from '../asset/race.js'
import { chooseProfession } from '../asset/professions.js';
import { chooseSkill } from '../asset/skills.js';
import { chooseItem } from '../asset/item.js';
import { chooseBasekit } from '../asset/equipment.js';

// Static DOM Elements
const $typeSelect = $('select[name="type"]');
const $subtypeSelect = $('select[name="subtype"]');
const $rankSelect = $('input[name="rank"]');
const $typeAmount = $('[name="amount"]');
const $choice_image_container = $('#choice-image-container');
const $choice_image = $('#choice-image');
const $choice_description = $('#choice-description');
const $choice_details = $('#choice-details');
const $choice_actions = $('#choice-actions');
const $modalLoading = $('div[data-id="modal-loading"]');

/*clearForm
--
*/
function clearForm($form) {
    $form.html('');
}

/*clearModal
--bClear, weither the modal should be completely cleared
*/
function clearModal(bClear) {
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

function updateModelDetails(sAction, oDetails = {}, arrModifier = [], arrSkills = []) {
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
        // Handle skills
        if (arrSkills.length > 0) {
            arrSkills.forEach((skill, i) => {
                const { id, name } = skill.details;
                const { sub_id = null, sub_name = null } = skill.current || {};
                const iconHtml = `${icons[id].icon}`;
                //creates a paragraph or selection
                if (arrSkills.length > 1) {
                    const row = $('<div>', { class: 'choice-row' });
                    if (sub_id && sub_name) {
                        const paragraph = $('<p>', { html: `${iconHtml} ${name} (${sub_name})` });
                        row.append(paragraph);
                    } else {
                        const input = $('<select>', { id: `skill-${i}`, value: sub_id, name: 'skill-modifier' });
                        Object.entries(skill.subtype).forEach(([key, subtype]) => {
                            const $option = $('<option>', { id: `skill-${key}`, value: `${subtype.id}`, text: `${subtype.name}` });
                            input.append($option);
                        });                            
                        const label = $('<label>', { for: `skill-${i}`, html: `${iconHtml} ${name}` });
                        row.append(label, input);
                    }                    
                    contentDetailsElements.push(row);
                } else {
                    contentDetailsElements.push($('<p>', { html: `${iconHtml} ${name} (${sub_name})` }));
                }
            });
        }
        // Append all elements to the DOM in one go
        $choice_details.empty().append(contentDetailsElements).show();
    } else {
        $choice_details.hide();
    }
}

function updateModelButtons(sAction, oData) {
    if (sAction && oData) {
        const { rule_page } = oData.details;
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
                click_function(sAction,oData);
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
    $typeSelect,
    $subtypeSelect,
    $rankSelect,
    $typeAmount,
    $choice_image_container,
    $choice_image,
    $choice_description,
    $choice_details,
    $choice_actions,
    $modalLoading,
    clearForm,
    clearModal,
    updateModalImage,
    updateModalDropdown,
    updateModelContent,
    updateModelDetails,
    updateModelButtons,
}
