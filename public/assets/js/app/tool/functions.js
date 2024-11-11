// Generic settings and functions
import { debug, icons, iconset, language, oTranslations, oCharacter } from './settings.js';
// Functions needed for actual app performance

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
 * Checks if an item already exists for the character.
 * @param {Array} attribute - The attribute array of the character.
 * @param {string} main_id - The main ID of the item.
 * @param {string|null} sub_id - The sub ID of the item (optional).
 * @returns {boolean} True if the item is duplicate, otherwise false.
 */
function checkDupplicateItem(attribute, main_id, sub_id = null) {
    return attribute.some(item => item.main_id === main_id && item.sub_id === sub_id);
}

/**
 * Adds an element to the specified container in the DOM.
 * @param {string} sAction - The action type (e.g., 'skill', 'profession', 'item').
 * @param {Object} element - The element to add.
 */
function addElement(sAction, element) {
    if (typeof element !== 'object' || element === null) {
        console.error("addElement: 'element' is not a valid object: " + $.type(element));
        return;
    }

    debugLog('addElement',sAction,element)

    const row = $('<div>', {
        class: 'grid-x choice-row animate__animated animate__fadeInLeft',
    });

    const arrColumn = [];
    const column_name = $('<div>', {
        class: 'cell small-5 text-left',
        text: `${element.name} ${element.rank != null ? ` (${icons.rank.text} ${element.rank})` : ''}`
    });
    arrColumn.push(column_name);

    let local_icons;

    if (sAction === 'skill' || sAction === 'profession') {
        const column_subname = $('<div>', {
            class: 'cell small-4 text-center',
            text: element.sub_name !== null ? element.sub_name : '-',
        });
        arrColumn.push(column_subname);

        const column_cost = $('<div>', {
            class: 'cell small-1 text-right',
            html: element.race ? `${oTranslations[language].racial}` : `${element.cost}pt.`
        });
        arrColumn.push(column_cost);

        local_icons = element.rank ? iconset["new_skill_with_rank"] : iconset["new_skill_no_rank"];
    } else if (sAction === 'item') {
        const column_amount = $('<div>', {
            class: 'cell small-2 text-right',
            text: `${element.amount}x`
        });
        arrColumn.push(column_amount);

        const column_cost = $('<div>', {
            class: 'cell small-3 text-right',
            html: `${currencyConvert(element.cost)}`
        });
        arrColumn.push(column_cost);

        local_icons = iconset["new_item"];
    }

    const arrIcons = local_icons.map(icon => $('<a>', {
        "data-action": `${sAction}-${icon}`,
        "data-id": element.id,
        "data-sub_id": element.sub_id,
        html: icons[icon].icon
    }));

    const column_action = $('<div>', {
        class: 'cell small-2 text-right',
        html: arrIcons
    });
    arrColumn.push(column_action);

    row.append(arrColumn);

    const $container = $(`[data-id="${sAction}-list"]`);
    let inserted = false;
    $container.children('.choice-row').each(function () {
        const currentRow = $(this);
        const currentName = currentRow.find('.cell.small-5.text-left').text().trim();
        if (currentName.localeCompare(element.name, undefined, { sensitivity: 'base' }) > 0) {
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

/**
 * Inserts a message into the DOM.
 * @param {string} element - The element selector to prepend the message to.
 * @param {string} type - The type of message (e.g., 'error', 'success').
 * @param {string} message - The message text.
 */
function showMessage(element, type, message) {
    $(element).prepend($('<p>', { class: `input-message input-${type} animate__animated animate__shakeX`, text: message }));
}

// Export functions
export {
    debugLog,
    checkDupplicateItem,
    addElement,
    initiateEditor,
    showMessage,
}