//Generic settings and functions
import { Character } from './character/character.js'
import { currentDateTime } from '../_lib/settings.js'
import { debugLog, initiateEditor } from '../_lib/functions.js'
import { pickName } from './character/name.js'
import { pickType } from './character/type.js'
import { pickStatus } from './character/status.js'
import { pickRace  } from './character_asset/race.js'
import { pickProfession } from './character_asset/professions.js'
import { pickSkillProfession, pickSkillCombat, pickSkillMagic, pickSkillDivine } from './character_asset/skills.js'
import { createNote } from './character/note.js'
import { convertCurrency } from './helper/currency.js'
import { pickItem } from './character_asset/item.js'
import { pickBasekit } from './character/equipment.js'
import { editAdventure, editBackground } from './helper/story.js'

$(document).ready(function() {

    /*
    This function will construct the sheet of the character based on information parsed.
    The controller sets the content of the page and once iniatiated a the value of a hidden input field
    determenes if the character is new or existing:
    -- if new, the standard calls will be made
    -- if existing, data should be shown on the sheet
    */
    
    if (window.character_input !== null && window.character_input !== undefined && window.character_input !== '') { 
        debugLog('Character information received, treating as excisting', window.character_input);        
        //--setup a character based on json input
        window.character = new Character (window.character_input);
        window.character.__construct();
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
    $('a[data-action="view-background"]').on('click', (e) => {
        e.preventDefault();
        viewBackground();
    });
    $('a[data-action="character-save"]').on('click', function (e) {
        e.preventDefault(); 
        window.character.save();
    });
    $('a[data-action="character-submit"]').on('click', function (e) {
        e.preventDefault(); 
        console.log(window.character.meta.status_name, window.character.meta.status)
        window.character.submit(window.character.meta.status_name,window.character.meta.status);
    });
    $('a[data-action="character-print"]').on('click', function (e) {
        e.preventDefault(); 
        window.character.print();
    });
    $('a[data-action="character-lock"]').on('click', function (e) {
        e.preventDefault(); 
        window.character.lock();
    });
    $('a[data-action="edit-adventure"]').on('click', function (e) {
        const storyId = $(this).data('id');
        e.preventDefault();
        editAdventure(storyId);
    });
    $('a[data-action="view-adventure"]').on('click', function (e) {
        const storyId = $(this).data('id');
        e.preventDefault();
        viewAdventure(storyId);
    });

});