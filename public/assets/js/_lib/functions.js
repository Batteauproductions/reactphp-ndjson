// Generic settings and functions
import { debug, icons, domain, oTranslations, language } from './settings.js';

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
 * Displays a confirmation modal before deleting a database item, then removes it via AJAX.
 *
 * @param {Event} e - The click event.
 * @param {string} sType - The type of item to delete (e.g., 'character').
 * @param {HTMLElement|jQuery} el - The clicked DOM element (can be a raw element or jQuery object).
 */
function deleteDatabaseElement(sType, el) {

    const $el = $(el);
    const char_id = $el.data('id');
    const $modal = $('#popup-modal');

    showPopup(
        `<p>${oTranslations[language].character_delete}</p>`,
        'confirm',
        'question',
        () => {
            $.ajax({
                url: `${domain}/action/${sType}-transfer`,
                type: 'POST',
                dataType: 'json',
                data: {
                    action: 'delete',
                    character: char_id
                },
                success: () => {
                    $(`div[data-character_id="${char_id}"]`).remove();
                    $modal.foundation('close');
                },
                error: () => {
                    const popupText = oTranslations[language].character_error;
                    showPopup(`<p>${popupText}</p>`, 'inform', 'error', () => {
                        $modal.foundation('close');
                    });
                    console.error(popupText);
                }
            });
        }
    );
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

function showPopup(message, type='inform', tone='', confirm = () => {}) {
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
            $confirm_btn.off('click').on('click',function() {
                confirm();
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
 * Generates interactive action icons for an asset based on its state.
 *
 * Determines which actions are allowed (upgrade, downgrade, remove),
 * and returns jQuery anchor elements with appropriate click handlers.
 *
 * @param {Object} asset - The asset object.
 * @param {number} asset.asset_value_ - The current asset_value of the asset (0 to 3).
 * @param {number} asset.asset_value_locked - The minimum locked asset_value.
 * @param {number} asset.asset_value_max - The maximum possible asset_value (default 3).
 * @param {Date|string} asset.created_dt - When the asset was added.
 * @param {Function} asset.remove - Method to remove the asset.
 * @param {Function} asset.upgrade - Method to upgrade the asset.
 * @param {Function} asset.downgrade - Method to downgrade the asset.
 * @returns {jQuery[]} Array of jQuery elements with appropriate handlers.
 */
function generateAssetIcons(asset) {
    const result = [];
    const lockedDt = window.character?.meta?.lastlocked_dt ?? null;

    const isItem = asset.attribute === 'item';

    const current = isItem ? asset.amount : asset.asset_value;
    const locked = isItem ? asset.amount_locked : asset.asset_value_locked;
    const max = asset.asset_value_max ?? 3;
    const createdAfterLock = lockedDt === null || asset.created_dt > lockedDt;

    const validActions = [];

    // --- Downgrade Logic ---
    const canDowngrade =
        current > 1 && (
            createdAfterLock ||
            locked === null ||
            current > locked
        );
    if (canDowngrade) {
        validActions.push('downgrade');
    }

    // --- Upgrade Logic ---
    const canUpgrade = isItem || (
        current < max &&
        !(
            asset.attribute === 'profession' &&
            current === max - 1 &&
            !window.gamemaster
        )
    );
    if (canUpgrade) {
        validActions.push('upgrade');
    }

    // --- Remove Logic ---
    if (asset.racial == 0 && createdAfterLock) {
        validActions.push('remove');
    }

    // --- Bind Event Handlers ---
    const eventHandlers = {
        remove: asset.remove?.bind(asset),
        upgrade: asset.upgrade?.bind(asset),
        downgrade: asset.downgrade?.bind(asset)
    };

    // --- Render Icons ---
    for (const action of validActions) {
        const icon = icons[action];
        const handler = eventHandlers[action] ?? null;

        if (icon?.render) {
            const htmlElement = icon.render(handler, false, '');
            result.push(htmlElement);
        }
    }

    return result;
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

    const $typeChosen = $type.next('.chosen-container');
    const $subtypeChosen = $sub_type.next('.chosen-container');

    const typeVisible = $typeChosen.is(':visible');
    const subtypeVisible = $subtypeChosen.is(':visible');

    const typeHasValue = $type.val();
    const subtypeHasValue = $sub_type.val();

    if ((typeVisible && typeHasValue) && !subtypeVisible) {
        return true;
    }

    if (subtypeVisible && subtypeHasValue) {
        return true;
    }

    return false;
}

function setDateTime() {
    const date = new Date();

    const pad = (n) => n.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    const mariadbDatetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return mariadbDatetime;
}


// Export functions
export {
    allowChoose,
    deleteDatabaseElement,
    showPopup,
    generateAssetIcons,
    debugLog,
    initiateEditor,
    showMessage,
    setDateTime,
}