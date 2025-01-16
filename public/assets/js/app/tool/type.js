import { oCharacter } from '../generator.js';
import { openTextModal } from './modal/text_modal.js';
import { updateCharacter } from './character.js';

function pickType() {
    openTextModal('type',$('#text-modal'));
}

function chooseType() {
    oCharacter.meta.name = $('input[name="character-name"]').val();
    $('[name="char_name"]').val(oCharacter.meta.name)
    $('#charactername').html(`<i class="fa-solid fa-rotate-right"></i>${oCharacter.meta.name}</span>`).on('click',changeName);   
    $('#text-modal').foundation('close');
    updateCharacter();
}

function changeType() {
    openTextModal('type',$('#text-modal'));
}

export {
    pickType,
    chooseType,
    changeType,
}