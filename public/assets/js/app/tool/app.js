//Generic settings and functions
import { oCharacter } from './settings.js'
import { debugLog, initiateEditor, currencyConvert } from './functions.js'
//Page functions
import { pickName } from './name.js'
import { pickRace } from './race.js'
import { pickProfession } from './professions.js'
import { pickSkillProfession, pickSkillCombat, pickSkillMagic } from './skills.js'
import { pickBasekit, pickItem } from './equipment.js'


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
        oCharacter = json_obj;            
        oCharacter.meta.status = 2;
    } else {
        debugLog('No character information received, treating as new');
        oCharacter.meta.status = 1;        
        $('body').find('[data-open="adventure-modal"]').addClass('disabled');
    }
    initiateEditor();
    $('#stat-currency').html(currencyConvert(oCharacter.build.currency));

    //This will bind the page function to their respective static elements
    $('a[data-action="pick-name"]').on('click', pickName);
    $('a[data-action="pick-race"]').on('click', pickRace);
    $('a[data-action="pick-profession"]').on('click', pickProfession);
    $('a[data-action="pick-skill-profession"]').on('click', pickSkillProfession);
    $('a[data-action="pick-skill-combat"]').on('click', pickSkillCombat);
    $('a[data-action="pick-skill-magic"]').on('click', pickSkillMagic);
    $('a[data-action="pick-basekit"]').on('click', pickBasekit);
    $('a[data-action="pick-item"]').on('click', pickItem);

});