//Generic settings and functions
import { Character } from './tool/character.js'
import { currentDateTime } from './tool/settings.js'
import { debugLog, initiateEditor } from './tool/functions.js'
import { pickName } from './tool/name.js'
import { pickType } from './tool/type.js'
import { pickStatus } from './tool/status.js'
import { pickRace  } from './tool/race.js'
import { pickProfession } from './tool/professions.js'
import { pickSkillProfession, pickSkillCombat, pickSkillMagic } from './tool/skills.js'
import { createNote } from './tool/note.js'
import { convertCurrency } from './tool/currency.js'
import { pickBasekit, pickItem } from './tool/equipment.js'
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
    } else {
        debugLog('No character information received, treating as new');    
        //--setup a new clean character object
        oCharacter = new Character({
            meta: {
                type: 1,
                status: 1,
                name: null,
                background: null,        
                created_dt: currentDateTime.toISOString(),
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
    $('a[data-action="create-note"]').on('click', createNote);
    $('a[data-action="pick-name"]').on('click', pickName);
    $('a[data-action="pick-type"]').on('click', pickType);
    $('a[data-action="pick-status"]').on('click', pickStatus);
    $('a[data-action="pick-race"]').on('click', pickRace);
    $('a[data-action="pick-profession"]').on('click', pickProfession);
    $('a[data-action="pick-skill-profession"]').on('click', pickSkillProfession);
    $('a[data-action="pick-skill-combat"]').on('click', pickSkillCombat);
    $('a[data-action="pick-skill-magic"]').on('click', pickSkillMagic);
    $('a[data-action="pick-basekit"]').on('click', pickBasekit);
    $('a[data-action="pick-item"]').on('click', pickItem);
    $('a[data-action="edit-background"]').on('click', editBackground);
    $('a[data-action="edit-adventure"]').on('click', editAdventure);

});

export {
    oCharacter
}