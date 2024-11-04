import {
    pickName
} from './name.js'

import {
    pickProfession
} from './professions.js'

import {
    pickSkillProfession,
    pickSkillCombat,
    pickSkillMagic,
} from './skills.js'

import {
    pickBasekit,
    pickItem,
} from './equipment.js'

$(document).ready(function() {
    /*
    This function will construct the sheet of the character based on information parsed.
    The controller sets the content of the page and once iniatiated a the value of a hidden input field
    determenes if the character is new or existing:
    -- if new, the standard calls will be made
    -- if existing, data should be shown on the sheet
    */
    const json_obj = JSON.parse($('input[name="character"]').val());
    if (json_obj !== null && json_obj !== undefined && json_obj !== '') { 
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

    //binding clicks on static DOM elements
    $('a[data-action="pick-name"]').on('click', pickName);
    $('a[data-action="pick-profession"]').on('click', pickProfession);
    $('a[data-action="pick-skill-profession"]').on('click', pickSkillProfession);
    $('a[data-action="pick-skill-combat"]').on('click', pickSkillCombat);
    $('a[data-action="pick-skill-magic"]').on('click', pickSkillMagic);
    $('a[data-action="pick-basekit"]').on('click', pickBasekit);
    $('a[data-action="pick-item"]').on('click', pickItem);

});