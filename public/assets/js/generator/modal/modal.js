//Generic settings and functions
import { domain, icons, language, oTranslations } from '../../_lib/settings.js';
import { allowChoose } from '../../_lib/functions.js';
import { convertCurrency } from '../helper/currency.js';
import { chooseRace } from '../character_asset/race.js'
import { chooseProfession } from '../character_asset/professions.js';
import { chooseSkill } from '../character_asset/skills.js';
import { chooseItem } from '../character_asset/item.js';
import { chooseBasekit } from '../character/equipment.js';

// Static DOM Elements
const $typeLabel = $('#lbl-type');
const $typeSelect = $('select[name="type"]');
const $subtypeLabel = $('#lbl-subtype');
const $subtypeSelect = $('select[name="subtype"]');
const $rankLabel = $('#lbl-subtype');
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
        $typeLabel.hide();
        $typeSelect.empty().trigger("chosen:updated");
        $typeAmount.val('1').hide();
    }    
    updateModalImage();   
    $subtypeLabel.hide();
    $subtypeSelect.empty().trigger("chosen:updated");  
    $rankLabel.hide();  
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
    const main_avatar = oData?.details?.avatar || null;
    const sub_avatar = oData?.current?.avatar || null;

    // Determine the image source and visibility
    let src = '';
    if (sub_avatar) {
        src = `${domain}/assets/images/character_asset/${sAction}/${sub_avatar}`;
    } else if (main_avatar) {
        src = `${domain}/assets/images/character_asset/${sAction}/${main_avatar}`;
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
    $element.trigger("chosen:updated");
    $typeLabel.show();
}

function updateModelContent(oData) {
    const oDetails = oData.details;
    const oCurrent = oData.current ?? null;
    // Check if oDetails is valid
    if (oData) {
        // Array for batch DOM adding
        const contentElements = [];
        // Create and push content elements only if they have content
        if (oDetails.name) {
            contentElements.push($('<h1>', { text: oDetails.name }));
        }
        if (oDetails.description) {
            contentElements.push($('<article>', { html: oDetails.description }));
        }
        //render subtype description
        if (oCurrent?.sub_description) {
            contentElements.push(`<hr><h2>${oCurrent.sub_name}</h2><p class="small-paragraph">${oCurrent.sub_description}</p>`);
        }
        // Clear existing content and append new content elements
        $choice_description.empty().append(contentElements).show();
    } else {
        // Hide the description if no details are provided
        $choice_description.hide();
        console.warn('no content was provided for this action')
    }
}

function updateModelDetails(sAction, oData) {
    //shorten oData
    const oDetails = oData.details;
    const arrModifier = oData.modifier;
    const arrSkills = oData.skills;    
    // Array for batch DOM adding
    const contentDetailsElements = [];

    // Check if action and details are valid or if there's a modifier
    if ((sAction && oData) || arrModifier.length > 0) {

        //render the cost
        if(oDetails.cost) {                        
            // Cost-related text to the element
            switch (sAction) {
                case 'skill_base':
                case 'skill_combat':
                case 'skill_magic':
                case 'skill_divine':
                case 'profession':
                    const rank_cost = oDetails.cost.split('|');
                    contentDetailsElements.push(icons.experience.render(null, true, rank_cost[0]));
                    break;
                case 'item':
                    contentDetailsElements.push(icons.coin.render(null, true, convertCurrency(oDetails.cost)));
                    break;
                default:
                    console.warn(`Unused action of ${sAction} has been called`);
                    break;
            }
        }
        
        // Add disclaimer paragraphs
        if (oDetails.disclaimer) {
            const arrDisclaimer = oDetails.disclaimer.split('|');
            arrDisclaimer.forEach(text => {
                contentDetailsElements.push(icons.disclaimer.render(null, false, text));
            });
        }
        
        // Add requirement name
        if (oDetails.requirement_name) {
            const arrRequirement = oDetails.requirement_name.split('|');
            arrRequirement.forEach(text => {
                contentDetailsElements.push(icons.required.render(null, false, text));
            });
        }

        // Add loresheet
        if (oDetails.loresheet == 1) {
            contentDetailsElements.push(icons.loresheet.render(null, true, ''));
        }
        // Handle modifiers        
        if (arrModifier && arrModifier.length > 0) {
            arrModifier.forEach((mod, i) => {
                const code = mod.code.toLowerCase();
                const iconHtml = icons[code].render(null, false, mod.description).outerHTML;
                if (arrModifier.length > 1) {
                    const row = $('<div>', { class: 'choice-row' });
                    const input = $('<input>', {
                                    id: `modifier-${i}`,
                                    value: mod.id,
                                    type: 'radio',
                                    name: 'stat-modifier',
                                    checked: i === 0 // sets checked only if i is 0
                                });
                    const label = $('<label>', { 
                                    for: `modifier-${i}`, 
                                    html: iconHtml 
                                });
                    row.append(input, label);
                    contentDetailsElements.push(row);
                } else {
                    contentDetailsElements.push($('<p>', { html: iconHtml }));
                }
            });
        }
        // Handle skills
        if (arrSkills && arrSkills.length > 0) {
            arrSkills.forEach((skill, i) => {
                const { id, name } = skill.details;
                const { sub_id = null, sub_name = null } = skill.current || {};
                const iconHtml = `${icons[id].icon()}`;
                //creates a paragraph or selection
                if (arrSkills.length > 1) {
                    const row = $('<div>', { class: 'choice-row' });
                    if (sub_id && sub_name) {
                        const paragraph = $('<p>', { html: `${iconHtml} ${name} (${sub_name})` });
                        row.append(paragraph);
                    } else {
                        const input = $('<select>', { id: `skill-${i}`, value: sub_id, name: 'skill-modifier' });
                        Object.entries(skill.subtype).forEach(([key, subtype]) => {
                            const $option = $('<option>', { id: `option-skill-${key}`, value: `${subtype.id}`, text: `${subtype.name}` });
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
        if(contentDetailsElements.length > 0) {
            $choice_details.empty().append(contentDetailsElements).show();
        } else {
            $choice_details.hide();
        }
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
            case 'skill_divine':                
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
                break;
            case 'basekit':
                click_function = chooseBasekit;
                break;
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
                html: `${icons.choose.icon()} ${icons.choose.text()}`,
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
                html: `${icons.more_info.icon()} ${icons.more_info.text()}`
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
    $typeLabel,
    $typeSelect,
    $subtypeLabel,
    $subtypeSelect,
    $rankLabel,
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
