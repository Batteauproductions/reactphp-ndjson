import { oCharacter } from '../../generator.js';
import { openTextModal } from '../modal/text_modal.js';
import { oTranslations, language, icons, currentDateTime } from '../settings.js';

/**
 * Represents a character note.
 */
class character_note {
    /**
     * @param {string} type - The type of the note.
     * @param {string} text - The content of the note.
     * @param {string} [created_dt] - Creation timestamp.
     * @param {string|null} [modified_dt] - Modification timestamp.
     */
    constructor(type, text, created_dt, modified_dt) {
        this.type = type;
        this.text = text;
        this.created_dt = created_dt || currentDateTime;
        this.modified_dt = modified_dt || null;
    }

    /**
     * Adds the note to the character and updates the DOM.
     * @returns {boolean}
     */
    add() {
        oCharacter.notes.push(this);

        const $note = $('<div>', {
            id: `wrapper-${this.type}`,
            html: `${this.text}`
        });

        const $container = $(`#container-${this.type}`);
        $container.append($note).show();

        $(`a[data-type="${this.type}"]`)
            .html(`${icons.edit.icon()} ${icons.edit.text()}`)
            .off('click') // Remove previous handlers if any
            .on('click', this.change.bind(this));

        $('#text-modal').foundation('close');
        return true;
    }

    /**
     * Opens a modal to edit the note.
     */
    change() {
        const contentElements = buildNoteElements(this.type, this.text, (value) => {
            this.text = value;
            $(`#wrapper-${this.type}`).html(value);
            $('#text-modal').foundation('close');
        });
        openTextModal(contentElements);
    }
}

/**
 * Builds the input elements for note creation or editing.
 * @param {string} type - The type of the note.
 * @param {string} text - The current text value.
 * @param {function(string): void} onSave - Callback for saving the note.
 * @returns {jQuery[]} Array of jQuery DOM elements.
 */
function buildNoteElements(type, text, onSave) {
    return [
        $('<label>', {
            for: `character-${type}`,
            text: `${oTranslations[language].note_add} (${type})`
        }),
        $('<textarea>', {
            id: `character-${type}`,
            name: type,
            html: text,
            rows: 10,
        }),
        $('<a>', {
            class: 'button solid',
            'data-type': type,
            html: `${icons.note_add.icon()} ${icons.note_add.text()}`
        }).on('click', function (e) {
            e.preventDefault();
            const value = $(`#character-${type}`).val();
            onSave(value);
        })
    ];
}

/**
 * Creates a new note based on the clicked element's data-type.
 */
function createNote(type) {
    const contentElements = buildNoteElements(type, '', (text) => {
        const note = new character_note(type, text);
        note.add();
    });
    openTextModal(contentElements);
}

export {
    character_note,
    createNote,
};
