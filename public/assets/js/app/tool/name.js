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
    openTextModal('name',$('#text-modal'));
}

export {
    changeName,
    chooseName,
    pickName,
}