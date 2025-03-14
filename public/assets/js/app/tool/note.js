import { oCharacter } from '../generator.js';
import { domain, iconset, language, oTranslations } from './settings.js';
import { openTextModal } from './modal/text_modal.js';
import { updateCharacter } from './character.js';

class character_note {
    constructor(id, type = 'personal') {
        this.id = id;
        this.type = type;
    }

    add() {
        oCharacter.notes.name = $('input[name="character-name"]').val();
        $('[name="char_name"]').val(oCharacter.meta.name)
        $('#charactername').html(`<i class="fa-solid fa-rotate-right"></i>${oCharacter.meta.name}</span>`).on('click',changeName);   
        $('#text-modal').foundation('close');
        updateCharacter();
    }
    
    change() {
        //openTextModal('name',$('#text-modal'));
    }

    remove() {
        oCharacter.removeAsset('notes', this);
        return true;
    }
}

function createNote() {
    const nid = oCharacter.notes.length ? oCharacter.notes.length : 1;
    const note = new character_note(nid, $(this).data('type'));
    let contentElements = [];
    contentElements.push($('<label>', { 
        for: 'character-name', 
        text: `${oTranslations[language].note_add} (${note.type})` 
    }));
    contentElements.push($('<textarea>', { 
        id: `${note.id}`, 
        name: `${note.type}`, 
        rows: 10,
    }));
    contentElements.push($('<a>', { 
        class: 'button solid','data-action': `${sAction}-choose`,
        html: `${icons.note_add.icon} ${icons.note_add.text}`
    }).on('click', function(e) {
        e.preventDefault();
        note.add();
    }));
    openTextModal(contentElements);
}

export {
    character_note,
    createNote,
}