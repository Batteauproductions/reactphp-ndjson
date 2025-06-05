//Generic settings and functions
import { Character } from './tool/character.js'
import { currentDateTime } from './tool/settings.js'
import { debugLog, initiateEditor } from './tool/functions.js'
import { pickName } from './tool/name.js'
import { pickType } from './tool/type.js'
import { pickStatus } from './tool/status.js'
import { pickRace  } from './tool/asset/race.js'
import { pickProfession } from './tool/asset/professions.js'
import { pickSkillProfession, pickSkillCombat, pickSkillMagic } from './tool/asset/skills.js'
import { createNote } from './tool/asset/note.js'
import { convertCurrency } from './tool/currency.js'
import { pickItem } from './tool/asset/item.js'
import { pickBasekit } from './tool/asset/equipment.js'
import { editAdventure, editBackground } from './tool/story.js'


//Page functions
let oCharacter;

$(document).ready(function() {

    /*
    This function will construct the sheet of the character based on information parsed.
    The controller sets the content of the page and once iniatiated a the value of a hidden input field
    determenes if the character is new or existing:
    -- if new, the standard calls will be made
    -- if existing, data should be shown on the sheet
    */
    const json_string = $('input[name="character"]').val();
    if (json_string !== null && json_string !== undefined && json_string !== '') { 
        const json_obj = JSON.parse(json_string);
        debugLog('Character information received, treating as excisting', json_obj);
        //--setup a character based on json input
        oCharacter = new Character (json_obj);
        oCharacter.__construct();
    } else {
        debugLog('No character information received, treating as new');    
        //--setup a new clean character object
        oCharacter = new Character({
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
    $('#stat-currency').html(convertCurrency(oCharacter.build.currency));
    
    //This will bind the page function to their respective static elements
    $('a[data-action="create-note"]').on('click', (e) => {
        e.preventDefault();
        createNote();
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
        oCharacter.save();
    });
    $('a[data-action="character-submit"]').on('click', (e) => {
        e.preventDefault(); 
        oCharacter.submit();
    });
    $('a[data-action="character-print"]').on('click', (e) => {
        e.preventDefault(); 
        oCharacter.print();
    });

});

export {
    oCharacter
}