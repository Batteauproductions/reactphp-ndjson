import { 
    oCharacter
} from './settings.js';

import {
    openTextModal,
} from './modal.js';


function pickName() {
    openTextModal('name');
}

function chooseName() {
    oCharacter.meta.name = $('input[name="character-name"]').val();
    $('[name="char_name"]').val(oCharacter.meta.name)
    $('#charactername').html(`<i class="fa-solid fa-rotate-right"></i>${oCharacter.meta.name}</span>`);   
    $('#text-modal').foundation('close');
    updateCharacter();
}

function changeName() {

}

export {
    pickName,
    chooseName,
    changeName,
}