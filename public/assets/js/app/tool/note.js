import { oCharacter } from '../generator.js';
import { openTextModal } from './modal/text_modal.js';
import { updateCharacter } from './character.js';
import { oTranslations, language, icons } from './settings.js';

class character_note {
    constructor({
        type = '',
        text = '',
        created_dt = new Date()
    } = {}) {
        this.type = type;
        this.text = text;
        this.created_dt = created_dt;
    }

    add() {
        oCharacter.addAsset('notes', this);        
        oCharacter.addAssetToSheet('notes', this);
        const $modal = $('#text-modal');
        $modal.foundation('close');

        return true;
    }

    remove() {
        oCharacter.removeAsset('notes', this);
        return true;
    }
}

function createNote() {
    const type = $(this).data('type');    
    let contentElements = [];
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
        const note = new character_note({ type, text });
        note.add();
    }));
    openTextModal(contentElements);
}

export {
    character_note,
    createNote,
}