import { oCharacter } from '../generator.js';
import { openTextModal } from './modal/text_modal.js';
import { oTranslations, language, icons } from './settings.js';

function changeName() {
    openTextModal('name',$('#text-modal'));
}

function chooseName() {
    const $element = $('input[name="character-name"]');
    oCharacter.setName($element.val());
    $('[name="char_name"]').val($element.val())
    $('#charactername').html(`<i class="fa-solid fa-rotate-right"></i>${$element.val()}</span>`).on('click',changeName);   
    $('#text-modal').foundation('close');
}

function pickName() {
    let contentElements = [];
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
        class: 'button solid','data-action': `name-choose`,
        html: `${icons.choose.icon} ${icons.choose.text}`
    }).on('click', function(e) {
        e.preventDefault();
        chooseName();
    }));          
    openTextModal(contentElements);
}

export {
    changeName,
    chooseName,
    pickName,
}