import { oCharacter } from '../../generator.js';
import { chooseName } from '../name.js';
import { debugLog } from '../functions.js';
import { oTranslations, language, icons } from '../settings.js';
import { clearForm, $modalLoading, } from "./modal.js";

/** 
 * This function opens the plain text modal
 * This function is used for the following actions
 * - changing name
 * - changing type
 * - changing status
 * 
 * @param {string} sAction - The action to perform ("adventure" or "background").
 * @param {jQuery} $modal - The jQuery object representing the modal to open.
*/
function openTextModal(sAction, $modal, oClass=null) {
    debugLog('openTextModal:', sAction, $modal);
    // Initialize modal to default state
    const $form = $('#text-form');    
    $modalLoading.show();
    $modal.foundation('open');
    clearForm($form);
    //container of elements to be place within the modal
    let contentElements = [];
    //switch the content of the modal based on action
    switch(sAction) {
        case 'note':
            console.log('oClass',oClass.type)
            contentElements.push($('<label>', { 
                for: 'character-name', 
                text: oTranslations[language].character_name 
            }));
            contentElements.push($('<textarea>', { 
                id: 'character-name', 
                name: 'character-name', 
                rows: 10,
                value: oCharacter.meta.name ? oCharacter.meta.name : ''
            }));
            break;
        case 'type':
            break;
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
            }).on('click', function(e) {
                e.preventDefault();
                chooseName();
            }));            
            break;
        default:
            console.warn(`openTextModal, unknown sAction called with value: ${sAction}`);
            break;
    }
    $modalLoading.hide();
    $form.append(contentElements).show();
}

export {
    openTextModal
} 