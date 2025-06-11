// Generic settings and functions
import { debug, icons, domain } from './settings.js';

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
            window.character.meta.background = editor.getData();
        });
    })
    .catch(error => {
        console.error(error);
    });
}

function showPopup(message, type='inform', tone='', confirm = {}) {
    debugLog('showPopup', message, type);
    const $modal = $('#popup-modal');
    const image = `system_${tone}`;
    //define buttons
    // -- confirm (ok) button
    const $confirm_btn = $('a[data-action="confirm-action"]');    
    $confirm_btn.html(`${icons.confirm.icon()} ${icons.confirm.text()}`);
    // -- cancel (x) button
    const $cancel_btn = $('a[data-action="cancel-action"]');
    $cancel_btn.html(`${icons.cancel.icon()} ${icons.cancel.text()}`);
    $cancel_btn.hide();
    //change functions based on type   
    switch(type) {
        case 'confirm':
            $confirm_btn.off('click').on('click', confirm);
            $cancel_btn.off('click').on('click', function(){ $modal.foundation('close') }).show();
            break;
        case 'inform':
            $confirm_btn.on('click',function() {
                $modal.foundation('close');
            });
            break;
        default:
            console.error(`showPopup, invalid type with value: ${type}, has been called`);
            break;
    }
    $modal.find('#popup-image').attr('src',`${domain}/assets/images/elements/${image}.png`);
    $modal.find('#popup-message').html(`${message}`);
    $modal.foundation('open');
}

/**
 * Generates a set of action icons with click event handlers for a given asset.
 *
 * @param {string[]} localIcons - Array of icon names to generate.
 * @param {Object} asset - The asset instance, expected to have `remove`, `upgrade`, and `downgrade` methods.
 * @returns {jQuery[]} Array of jQuery anchor elements representing icons.
 */
function generateIconSet(iconArray, asset) {
    const icons = [];

    const eventHandlers = {
        remove: asset.remove?.bind(asset),
        upgrade: asset.upgrade?.bind(asset),
        downgrade: asset.downgrade?.bind(asset)
    };

    if (!Array.isArray(iconArray)) return icons;

    for (const { name, icon } of iconArray) {
        const handler = eventHandlers[name] ?? null;
        const htmlElement = icon.render(handler, false, '');
        icons.push(htmlElement);
    }

    return icons;
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