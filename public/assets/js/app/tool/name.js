import { openTextModal } from './modal/text_modal.js';
import { oTranslations, language, icons } from './settings.js';

function changeName() {
    openTextModal('name',$('#text-modal'));
}

function chooseName() {
    const $element = $('input[name="character-name"]');
    window.character.setName($element.val());
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
        value: window.character.meta.name ? window.character.meta.name : ''
    }));
    contentElements.push(icons.choose.render(chooseName,true,''));        
    openTextModal(contentElements);
}

export {
    changeName,
    chooseName,
    pickName,
}