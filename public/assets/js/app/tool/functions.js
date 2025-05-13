// Generic settings and functions
import { oCharacter } from '../generator.js';
import { debug, icons } from './settings.js';

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
        });
    })
    .catch(error => {
        console.error(error);
    });
}

function showPopup(message, type='inform') {
    const $modal = $('#popup-modal');
    const $confirm_btn = $('a[data-action="confirm-action"]');
    const $cancel_btn = $('a[data-action="cancel-action"]');
    switch(type) {
        case 'confirm':
            break;
        case 'inform':
            break;
        default:
            console.error(`showPopup, invalid type with value: ${type}, has been called`);
            break;
    }
    $modal.find('#popup-message').html(message);
    $modal.foundation('open');
    alert(message);
}

/**
 * Generates a set of action icons with click event handlers for a given asset.
 *
 * @param {string[]} localIcons - Array of icon names to generate.
 * @param {Object} asset - The asset instance, expected to have `remove`, `upgrade`, and `downgrade` methods.
 * @param {string} attribute - Attribute prefix used for data-action.
 * @returns {jQuery[]} Array of jQuery anchor elements representing icons.
 */
function generateIconSet(localIcons, asset, attribute) {
    return $.map(localIcons, (icon) => {
        if (!icons[icon]) {
            console.warn(`Icon "${icon}" not found.`);
            return null; // Skip invalid icons
        }

        // Determine appropriate event handler
        const eventHandlers = {
            remove: asset.remove?.bind(asset),
            upgrade: asset.upgrade?.bind(asset),
            downgrade: asset.downgrade?.bind(asset)
        };
        
        const clickEventHandler = Object.entries(eventHandlers).find(([key]) => icon.includes(key))?.[1];

        // Create anchor element
        const $anchor = $('<a>', {
            "data-action": `${attribute}-${icon}`,
            "data-id": asset.id,
            "data-sub_id": asset.sub_id,
            html: icons[icon].icon
        });

        // Attach event handler if found
        if (clickEventHandler) {
            $anchor.on('click', function (event) {
                event.preventDefault();
                clickEventHandler();
            });
        }

        return $anchor;
    }).filter(Boolean); // Remove null values from the array
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

/**
 * Checks whether the input fields 'type' and 'sub_type' are valid for choosing based on visibility and values.
 * @returns {boolean} Returns `true` if the conditions for choosing are met, otherwise `false`.
 */
function allowChoose() {
    const $type = $('select[name="type"]');
    const $sub_type = $('select[name="subtype"]');

    if(($type.is(':visible') && $type.val()) && !$sub_type.is(':visible')) {
        return true;
    }

    if($sub_type.is(':visible') && $sub_type.val()) {
        return true;
    }

    return false;
}


// Export functions
export {
    allowChoose,
    showPopup,
    debugLog,
    generateIconSet,
    initiateEditor,
    showMessage,
}