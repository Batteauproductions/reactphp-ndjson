import { oCharacter } from '../generator.js';
import { openTextModal } from './modal/text_modal.js';
import { updateCharacter } from './character.js';

class character_type {
    pick() {
        openTextModal('type',$('#text-modal'));
    }

    choose() {
        oCharacter.meta.name = $('input[name="character-name"]').val();
        $('[name="char_name"]').val(oCharacter.meta.name)
        $('#charactername').html(`<i class="fa-solid fa-rotate-right"></i>${oCharacter.meta.name}</span>`).on('click',changeName);   
        $('#text-modal').foundation('close');
        updateCharacter();
    }

    change() {
        openTextModal('type',$('#text-modal'));
    }
}

export {
    character_type
}