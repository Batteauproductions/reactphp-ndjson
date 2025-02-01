import { oCharacter } from '../generator.js';
import { openTextModal } from './modal/text_modal.js';
import { updateCharacter } from './character.js';

function changeName() {
    openTextModal('name',$('#text-modal'));
}

function chooseName() {
    oCharacter.meta.name = $('input[name="character-name"]').val();
    $('[name="char_name"]').val(oCharacter.meta.name)
    $('#charactername').html(`<i class="fa-solid fa-rotate-right"></i>${oCharacter.meta.name}</span>`).on('click',changeName);   
    $('#text-modal').foundation('close');
    updateCharacter();
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
        class: 'button solid','data-action': `${sAction}-choose`,
        html: `${icons.choose.icon} ${icons.choose.text}`
    }).on('click', function(e) {
        e.preventDefault();
        chooseName();
    }));          
    openTextModal('name',$('#text-modal'),contentElements);
}

export {
    changeName,
    chooseName,
    pickName,
}