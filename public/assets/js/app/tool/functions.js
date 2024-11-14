// Generic settings and functions
import { debug, icons, iconset, language, oTranslations, oCharacter } from './settings.js';
import { removeProfession, upgradeProfession } from './professions.js';
import { removeSkill, upgradeSkill } from './skills.js';
import { removeItem } from './equipment.js';

// Page functions

/**
 * Logs messages to the console when in debug mode.
 * @param {string} message - The message to log.
 * @param {...any} optionalParams - Additional parameters to log.
 */
function debugLog(message, ...optionalParams) {
    if (debug) {
        console.log(message, ...optionalParams);
    }
}

/**
 * Adds an element to the specified container in the DOM.
 * @param {string} sAction - The action type (e.g., 'skill', 'profession', 'item').
 * @param {Object} characterAsset - The element to add.
 */
function addCharacterAsset(sAction, characterAsset) {
    if (typeof characterAsset !== 'object' || characterAsset === null) {
        console.error("addCharacterAsset: 'element' is not a valid object: " + $.type(element));
        return;
    }
    
    debugLog('addCharacterAsset', sAction, characterAsset);

    const row = $('<div>', {
        class: 'grid-x choice-row animate__animated animate__fadeInLeft',
        "data-id": characterAsset.id,
        "data-sub_id": characterAsset.sub_id
    });

    const arrColumn = [
        $('<div>', {
            class: 'cell small-5 text-left',
            text: `${characterAsset.name} ${characterAsset.rank != null ? ` (${icons.rank.text} ${characterAsset.rank})` : ''}`
        })
    ];

    let local_icons;
    switch (sAction) {
        case 'skill':
        case 'profession':
            arrColumn.push($('<div>', {
                class: 'cell small-4 text-center',
                text: characterAsset.sub_name !== null ? characterAsset.sub_name : '-'
            }));

            arrColumn.push($('<div>', {
                class: 'cell small-1 text-right',
                html: characterAsset.race ? `${oTranslations[language].racial}` : `${characterAsset.cost}pt.`
            }));

            local_icons = characterAsset.rank ? iconset["new_skill_with_rank"] : iconset["new_skill_no_rank"];
            break;
        case 'item':
            arrColumn.push($('<div>', {
                class: 'cell small-2 text-right',
                text: `${characterAsset.amount}x`
            }));

            arrColumn.push($('<div>', {
                class: 'cell small-3 text-right',
                html: `${currencyConvert(characterAsset.cost)}`
            }));

            local_icons = iconset["new_item"];
            break;
    }

    const actionHandlers = {
        profession: { removeFunction: removeProfession, upgradeFunction: upgradeProfession },
        skill: { removeFunction: removeSkill, upgradeFunction: upgradeSkill },
        item: { removeFunction: removeItem, upgradeFunction: null }
    };

    const { removeFunction, upgradeFunction } = actionHandlers[sAction] || {};

    const arrIcons = $.map(local_icons, function(icon) {

        let clickEventHandler = null;
        if (icon.includes('remove')) {
            clickEventHandler = removeFunction;
        } else if (icon.includes('upgrade')) {
            clickEventHandler = upgradeFunction;
        }

        const $anchor = $('<a>', {
            "data-action": `${sAction}-${icon}`,
            "data-id": characterAsset.id,
            "data-sub_id": characterAsset.sub_id,
            html: icons[icon].icon
        });

        if (clickEventHandler) {
            $anchor.on('click', function() {
                clickEventHandler(characterAsset);
            });
        }

        return $anchor;
    });

    arrColumn.push($('<div>', {
        class: 'cell small-2 text-right',
        html: arrIcons
    }));

    row.append(arrColumn);

    const $container = $(`[data-id="${sAction}-list"]`);
    let inserted = false;
    $container.children('.choice-row').each(function() {
        const currentRow = $(this);
        const currentName = currentRow.find('.cell.small-5.text-left').text().trim();
        if (currentName.localeCompare(characterAsset.name, undefined, { sensitivity: 'base' }) > 0) {
            currentRow.before(row);
            inserted = true;
            return false;
        }
    });

    if (!inserted) {
        $container.append(row);
    }
}

/**
 * Initializes the WYSIWYG editor.
 */
function initiateEditor() {
    const maxCharacters = 10000;
    const container = document.querySelector('#ck-count-container');
    const progressCircle = document.querySelector('.update__chart__circle');
    const charactersBox = document.querySelector('.update__chart__characters');
    const wordsBox = document.querySelector('.update__words');
    const circleCircumference = Math.floor(2 * Math.PI * progressCircle.getAttribute('r'));

    ClassicEditor.create(document.querySelector('#background'), {
        attributes: { 'color': '#fff' },
        heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
            ]
        },
        wordCount: {
            onUpdate: stats => {
                const charactersProgress = stats.characters / maxCharacters * circleCircumference;
                const isLimitExceeded = stats.characters > maxCharacters;
                const isCloseToLimit = !isLimitExceeded && stats.characters > maxCharacters * 0.8;
                const circleDashArray = Math.min(charactersProgress, circleCircumference);

                progressCircle.setAttribute('stroke-dasharray', `${circleDashArray},${circleCircumference}`);

                charactersBox.textContent = isLimitExceeded ? `-${stats.characters - maxCharacters}` : stats.characters;
                wordsBox.textContent = `Woorden: ${stats.words}`;

                container.classList.toggle('update__limit-close', isCloseToLimit);
                container.classList.toggle('update__limit-exceeded', isLimitExceeded);
            }
        }

    })
    .then(editor => {
        editor.model.document.on('change:data', () => {
            oCharacter.meta.background = editor.getData();
            updateCharacter();
        });
    })
    .catch(error => {
        console.error(error);
    });
}

function showPopup(message) {
    alert(message);
}

/**
 * Inserts a message into the DOM, replacing any existing messages.
 * @param {string} element - The element selector to insert the message into.
 * @param {string} type - The type of message (e.g., 'error', 'success').
 * @param {string} message - The message text.
 */
function showMessage(element, type, message) {
    // Remove any existing message within the element
    $(element).find('.input-message').remove();
    
    // Insert the new message
    $(element).append($('<p>', { 
        class: `input-message input-${type} animate__animated animate__shakeX`, 
        text: message 
    }));
}

// Export functions
export {
    showPopup,
    debugLog,
    addCharacterAsset,
    initiateEditor,
    showMessage,
}