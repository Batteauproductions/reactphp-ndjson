// Generic settings and functions
import { domain, oTranslations, language } from '../../_lib/settings.js';
import { debugLog } from '../../_lib/functions.js';
import { openSelectionModal, updateModalDropdown } from '../modal/selection_modal.js';
import { Skill } from './skills.js';

// Define the class
class Race {
    constructor({
        details: {
            id,
            name,
        },
        modifier = [], // Default to an empty array for safety
        skills = [], // Default to an empty array for safety
    }) {
        this.id = parseInt(id);
        this.name = name;
        this.modifier = modifier.length > 0 && modifier[0]?.id !== undefined ? parseInt(modifier[0].id) : null;
        this.skills = skills.length > 0 ? skills : null;
    }

    //adds the race to the character
    add() {            
        // Add racial skills
        if (this.skills.length > 0) {
            this.skills.forEach(skill => {
                //checks non standard skills
                let cSkill;
                if(!skill.current) {
                    $('[name="skill-modifier"]').each(function () {
                        const $select = $(this);
                        const subid = parseInt($select.find('option:selected').val());
                        const subname = $select.find('option:selected').text();

                        //an empty choice exists
                        if(!subid && !subname) {
                            showMessage('#choice-actions', 'error', oTranslations[language].not_choice_made);
                            return
                        }
                        skill.current = {}; // Initialize the object
                        Object.assign(skill.current, {
                            sub_id: subid,
                            sub_name: subname
                        });
                        Object.assign(skill.current, {
                            attribute: "skill",
                            container: "skill_base",
                            cost: 0,
                            racial: 1
                        });
                        cSkill = new Skill(skill); 
                        cSkill.add();  
                    });                                      
                } else {
                    Object.assign(skill.current, {
                        attribute: "skill",
                        container: "skill_base",
                        cost: 0,
                        racial: 1
                    });
                    const cSkill = new Skill(skill);
                    cSkill.add();
                }
               
            });
        } 
        // Assign race to character
        const stat = $('[name="stat-modifier"]:checked').val();
        this.modifier = stat ? stat : this.modifier;
        window.character.race = this;       
        // Update the stats if a modifier is present
        window.character.update();
        // Allow race to be re-chosen
        window.character.setRace(this.name);
        
        return true;
    }

    //removes the race from the character
    remove () {
        //remove old racial skills
        for (let i = window.character.skill.length - 1; i >= 0; i--) {
            const skill = window.character.skill[i];
            if (skill.racial === true) {
                skill.remove();
            }
        }

        window.character.race = null;
        return true;
    }
}

// Page functions

/**
 * Pick a race (functionality not implemented).
 */
function pickRace() {
    debugLog('pickRace');

    const $modal = $('#selection-modal');
    const $form = $('#modal-form');
    const sAction = 'race';

    openSelectionModal(sAction, $modal);

    $.ajax({
        url: `${domain}/action/get-dropdown`,
        type: 'POST',
        dataType: 'json',
        data: {
            action: `fill-dropdown-${sAction}`,
        },
        success: function(data) {
            debugLog('pickRace[data]', data);
            const $select = $('select[name="type"]');
            $('div[data-id="modal-loading"]').hide();
            updateModalDropdown($select, data);
            $form.show();
        },
        error: function(error) {
            console.error('pickProfession: Error fetching data:', error);
        }
    });
}

/**
 * Choose a race for the character.
 * @param {Object} obj - The race object.
 */
function chooseRace(sAction, obj) {
    debugLog('pickRace', obj);

    // Validate that the input is a valid object
    if (typeof obj !== 'object' || obj === null) {
        console.error("chooseRace: 'obj' is not a valid object: " + $.type(obj));
        return;
    }

    //check if there already is a race
    if (window.character.race && window.character.race.id) {
        window.character.race.remove();
    }

    //--Add the current asset to the object
    obj.details = {
        ...obj.details,
    }

    const raceClass = new Race(obj);

    if (raceClass.add()) {
        $('#selection-modal').foundation('close');
    }
}

// Export functions
export {
    Race,
    pickRace,
    chooseRace,
}