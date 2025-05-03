import { oCharacter } from '../generator.js';
import { openTextModal } from './modal/text_modal.js';
import { updateCharacter } from './character.js';
import { oTranslations, language, icons, currentDateTime } from './settings.js';

class character_note {
    constructor(
        type,
        text,
        created_dt,
        modified_dt,
    ) {
        this.type = type;
        this.text = text;
        this.created_dt = created_dt ? created_dt : currentDateTime;
        this.modified_dt = modified_dt ? modified_dt : null;
    }

    add() {
        oCharacter.notes.push(this);
        const $note = $('<div>', {
            id: `wrapper-${this.type}`,
            html: `${this.text}`
        }) 
        const $container = $(`#container-${this.type}`);               
        $container.append($note);
        $container.show();
        $(`a[data-type="${this.type}"]`).html(`${icons.edit.icon} ${icons.edit.text}`).on('click',this.change);

        const $modal = $('#text-modal');
        $modal.foundation('close');

        updateCharacter();
        return true;
    }
    
    change() {
        let contentElements = [];
        contentElements.push($('<label>', { 
            for: `character-${this.type}`, 
            text: `${oTranslations[language].note_add} (${this.type})` 
        }));
        contentElements.push($('<textarea>', { 
            id: `character-${this.type}`, 
            name: `${this.type}`,
            html: `${this.text}`, 
            rows: 10,
        }));
        contentElements.push($('<a>', { 
            class: 'button solid',
            'data-type': `${this.type}`,
            html: `${icons.note_add.icon} ${icons.note_add.text}`
        }).on('click', function(e) {
            e.preventDefault(); 
            const $container = $(`#container-${this.type}`);    
            const $modal = $('#text-modal');
            $modal.foundation('close'); 
        }));
        openTextModal(contentElements);
    }
}

function createNote() {
    let contentElements = [];
    const type = $(this).data('type');
    contentElements.push($('<label>', { 
        for: `character-${type}`, 
        text: `${oTranslations[language].note_add} (${type})` 
    }));
    contentElements.push($('<textarea>', { 
        id: `character-${type}`, 
        name: `${type}`,
        html: ``, 
        rows: 10,
    }));
    contentElements.push($('<a>', { 
        class: 'button solid',
        'data-type': `${type}`,
        html: `${icons.note_add.icon} ${icons.note_add.text}`
    }).on('click', function(e) {
        e.preventDefault();        
        const text = $(`textarea[id="character-${type}"]`).val();
        const note = new character_note(type, text);
        note.add();
    }));
    openTextModal(contentElements);
}

export {
    character_note,
    createNote,
}