//Generic settings and functions
import { oCharacter } from './settings.js'
import { debugLog } from './functions.js'
//Functions needed for actual app performance
import { addToCharacter, removeFromCharacter } from './character.js';

function pickBasekit () {

}

function chooseBasekit() {
    let $element = $('div[data-id="base_kit-list"]');
    oCharacter.build.base_kit = parseInt(oTempData.details.id);
    let container = $('<div>', {
        html: `<h3 data-title>${oTempData.details.name}</h3><p data-description>${oTempData.details.description}</p>`
    });
    let icon = icons["change"];
    $('a[data-type="base_kit"]').html(`${icon.icon} ${icon.text}`);
    $element.empty().append(container);
    updateCharacter();
    $('#selection-modal').foundation('close');
}

//These functions deal with adding, altering or removing items from the character
//obj: The item that is being parsed
function addItem(obj) { 
    oTempData.amount = ($('input[name="amount"]').val() !== '') ? parseInt($('input[name="amount"]').val()) : 1;
                oTempData.cost = parseInt(oTempData.amount) * parseInt(oTempData.details.price);
                handleChoice(oTempData,itemAdd,sAction,'item');   
    if (typeof obj === 'object') {
        addToCharacter(oCharacter.items,'item',obj)
    } else {
        console.error("itemAdd is not an object: " +$.type(obj));
    }
}

function pickItem () {

}

//This function will remove a items to the character
//obj: The item that is being parsed
function removeItem(element,main_id,sub_id) {
    removeFromCharacter(oCharacter.items,element,'item',main_id,sub_id)
}

export {
    pickBasekit,
    chooseBasekit,
    addItem,
    pickItem,
    removeItem,
}