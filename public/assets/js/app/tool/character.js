//Generic settings and functions
import { domain, icons, oCharacter } from './settings.js';
import { debugLog } from './functions.js';

/*Add elements to the character
//-attribute: 
---oCharacter.profession
---oCharacter.skills
---oCharacter.items
//-type:
---profession
---skill
---item
//-subject: the object that is being parsed
*/
function addToCharacter(attribute,type,subject) {
    debugLog('addToCharacter');
    if (typeof subject === 'object') {        
        //firstly: add the subject to the attribute called
        attribute.push(subject);
        //secondly: spend the experience / currency needed for this subject
        if (type === "profession" || type === "skill") {
            experienceSpend(subject.cost);
        } else if (type === "item") {
            currencySpend(subject.cost);
        }         
        //thirdly: check if the subject has a modifier, if so update the character stats
        if (subject.modifier.length > 0) {
            updateCharacterStats();
        }   
        //finaly: update the visual part of the character sheet
        updateCharacter();       
    } else {
        console.error("characterAddTo: argument 'subject' is not an object: " + $.type(subject));
    }
}

/*--characterRemoveFrom
//-attribute: 
---oCharacter.profession
---oCharacter.skills
---oCharacter.items
//-element: The element that is calling the action, is basically $(this)
//-main_id: The main_id of the skill/profession/item
//-sub_id: The sub_id of the skill/profession/item
*/
function removeFromCharacter(attribute,element,type,main_id,sub_id=null) {
    debugLog('removeFromCharacter');
    let itemFound = false;
    let subject = {};
    //runs through the entire list of items in the attribute and stops when found
    for (let i = 0; i < attribute.length; i ++) {
        if(attribute[i].main_id == main_id && attribute[i].sub_id == sub_id) {            
            subject = attribute[i];
            attribute.splice(i,1);
            itemFound = true;
            break;
        } else {  
            console.error('characterRemoveFrom: Item not found');        
        }
    }
    if (!itemFound) {
        console.error('Item not found');
    } else {  
        if (subject.modifier && subject.modifier.length > 0) {
            updateCharacterStats();
        }
        if (type === "profession" || type === "skill") {
            experienceRefund(subject.cost);
        } else if (type === "item") {
            currencyRefund(subject.cost);
        }
        //check if the subject has a modifier
        if (subject.modifier.length > 0) {
            updateCharacterStats();
        }
        //remove the element from the DOM
        element.parent().parent().remove();
    } 
}

function saveCharacter() {
    transferCharacter('save');
}

function submitCharacter() {
    transferCharacter('submit');
}

function transferCharacter(sAction) {
    if ($("#form-character").valid()) {                
        $button.attr('disabled', true);
        $button.html(`${icons.character_saving.icon} ${icons.character_saving.text}`)
        $.ajax({
            url: `${domain}/action/character-save`,
            data: {
                action: sAction,
                character: JSON.stringify(oCharacter)
            },
            type: 'POST',
            dataType: 'json',
            success: function(data) {
                $button.html(`${icons.character_save_done.icon} ${icons.character_save_done.text}`);
                $button.attr('disabled', false);
            },
            error: function(error) {
                $button.html(`${icons.character_error.icon} ${icons.character_error.text}`);
                $button.attr('disabled', false);
            }
        });
    } else {
        console.warn('Form is not valid');
    }
}

export {
    addToCharacter,
    removeFromCharacter,
    saveCharacter,
    submitCharacter,
}