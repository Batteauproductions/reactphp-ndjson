//Generic settings and functions
import { Character } from './tool/character.js'
import { currentDateTime } from './tool/settings.js'
import { debugLog, initiateEditor } from './tool/functions.js'
import { pickName } from './tool/name.js'
import { pickType } from './tool/type.js'
import { pickStatus } from './tool/status.js'
import { pickRace  } from './tool/asset/race.js'
import { pickProfession } from './tool/asset/professions.js'
import { pickSkillProfession, pickSkillCombat, pickSkillMagic, pickSkillDivine } from './tool/asset/skills.js'
import { createNote } from './tool/asset/note.js'
import { convertCurrency } from './tool/currency.js'
import { pickItem } from './tool/asset/item.js'
import { pickBasekit } from './tool/asset/equipment.js'
import { editAdventure, editBackground } from './tool/story.js'

$(document).ready(function() {

    /*
    This function will construct the sheet of the character based on information parsed.
    The controller sets the content of the page and once iniatiated a the value of a hidden input field
    determenes if the character is new or existing:
    -- if new, the standard calls will be made
    -- if existing, data should be shown on the sheet
    */
    
    if (window.character_input !== null && window.character_input !== undefined && window.character_input !== '') { 
        debugLog('Character information received, treating as excisting', character);        
        //--setup a character based on json input
        window.character = new Character (character_input);
        window.character.__construct();
        //check what adventures can be edited
        const created_dt = window.character.meta.created_dt ? new Date(window.character.meta.created_dt) : null; 
        $('a[data-action="edit-adventure"]').each(function() {
            var dateStr = $(this).data('date'); // gets the value of data-date
            var elDate = new Date(dateStr);
            if (elDate < created_dt) {
                $(this).addClass('disabled');
            }
        });
    } else {
        debugLog('No character information received, treating as new');    
        //--setup a new clean character object
        window.character = new Character({
            meta: {
                type: 1,
                status: 1,
                name: null,
                background: null,        
                created_dt: currentDateTime,
                modified_dt: null,
                firstlocked_dt: null,
                lastlocked_dt: null,
            },
        });
        //--new characters cannot edit adventurers, only background            
        $('body').find('a[data-action="edit-adventure"]').addClass('disabled');
    }

    initiateEditor();
    $('#stat-currency').html(convertCurrency(window.character.build.currency));
    
    //This will bind the page function to their respective static elements
    $('a[data-action="create-note"]').on('click', function(e) {
        e.preventDefault();
        createNote($(this).data('type')); 
    });
    $('a[data-action="pick-name"]').on('click', (e) => {
        e.preventDefault();
        pickName();
    });
    $('a[data-action="pick-type"]').on('click', (e) => {
        e.preventDefault();
        pickType();
    });
    $('a[data-action="pick-status"]').on('click', (e) => {
        e.preventDefault();
        pickStatus();
    });
    $('a[data-action="pick-race"]').on('click', (e) => {
        e.preventDefault();
        pickRace();
    });
    $('a[data-action="pick-profession"]').on('click', (e) => {
        e.preventDefault();
        pickProfession();
    });
    $('a[data-action="pick-skill-profession"]').on('click', (e) => {
        e.preventDefault();
        pickSkillProfession();
    });
    $('a[data-action="pick-skill-combat"]').on('click', (e) => {
        e.preventDefault();
        pickSkillCombat();
    });
    $('a[data-action="pick-skill-magic"]').on('click', (e) => {
        e.preventDefault();
        pickSkillMagic();
    });
    $('a[data-action="pick-skill-divine"]').on('click', (e) => {
        e.preventDefault();
        pickSkillDivine();
    });
    $('a[data-action="pick-basekit"]').on('click', (e) => {
        e.preventDefault();
        pickBasekit();
    });
    $('a[data-action="pick-item"]').on('click', (e) => {
        e.preventDefault();
        pickItem();
    });
    $('a[data-action="edit-background"]').on('click', (e) => {
        e.preventDefault();
        editBackground();
    });
    $('a[data-action="character-save"]').on('click', (e) => {
        e.preventDefault(); 
        window.character.save();
    });
    $('a[data-action="character-submit"]').on('click', (e) => {
        e.preventDefault(); 
        window.character.submit();
    });
    $('a[data-action="character-print"]').on('click', (e) => {
        e.preventDefault(); 
        window.character.print();
    });
    $('a[data-action="edit-adventure"]').on('click', (e) => {
        e.preventDefault();
        editAdventure();
    });

});