import { oCharacter } from '../generator.js';
import { openTextModal } from './modal/text_modal.js';
import { updateCharacter } from './character.js';

class character_note {
    constructor(type = 'personal') {
        this.type = type;
    }

    create() {
        openTextModal('note',$('#text-modal'),this);
    }
    
    set() {
        oCharacter.meta.name = $('input[name="character-name"]').val();
        $('[name="char_name"]').val(oCharacter.meta.name)
        $('#charactername').html(`<i class="fa-solid fa-rotate-right"></i>${oCharacter.meta.name}</span>`).on('click',changeName);   
        $('#text-modal').foundation('close');
        updateCharacter();
    }
    
    change() {
        openTextModal('name',$('#text-modal'));
    }
}

export {
    character_note
}