import { oCharacter } from '../generator.js';
import { openTextModal } from './modal/text_modal.js';
import { updateCharacter } from './character.js';
import { oTranslations, language, icons, currentDateTime } from './settings.js';

class character_note {
    constructor(
        type,
        text,
        created_dt
    ) {
        this.type = type;
        this.text = text;
        this.created_dt = created_dt ? created_dt : currentDateTime;
    }

    add() {
        oCharacter.notes.push(this);
        const $container = $(`container-${this.type}`);
        const $note = $('<div>', {
            html: this.text
        })        
        $container.append($note);
        $container.show();
        const $modal = $('#text-modal');
        $modal.foundation('close');

        updateCharacter();
        return true;
    }
    
    change() {
        openTextModal('note',$('#text-modal'));
    }
}

function createNote() {
    let contentElements = [];
    const type = $(this).data('type');
    contentElements.push($('<label>', { 
        for: 'character-name', 
        text: `${oTranslations[language].note_add} (${type})` 
    }));
    contentElements.push($('<textarea>', { 
        id: `${type}`, 
        name: `${type}`, 
        rows: 10,
    }));
    contentElements.push($('<a>', { 
        class: 'button solid',
        'data-type': `${type}`,
        html: `${icons.note_add.icon} ${icons.note_add.text}`
    }).on('click', function(e) {
        e.preventDefault();        
        const text = $(`textarea[id="${type}"]`).val();
        const note = new character_note(type, text);
        note.add();
    }));
    openTextModal(contentElements);
}

export {
    character_note,
    createNote,
}