//Generic settings and functions
import { oCharacter } from '../../generator.js';
import { debugLog } from '../functions.js';

function pickBasekit () {
    debugLog('pickBasekit');
}

function chooseBasekit(obj) {
    debugLog('chooseBasekit', obj);
    let $element = $('div[data-id="base_kit-list"]');
    oCharacter.build.base_kit = parseInt(oTempData.details.id);
    let container = $('<div>', {
        html: `<h3 data-title>${oTempData.details.name}</h3><p data-description>${oTempData.details.description}</p>`
    });
    let icon = icons["change"];
    $('a[data-type="base_kit"]').html(`${icon.icon} ${icon.text}`);
    $element.empty().append(container);
    oCharacter.update();
    $('#selection-modal').foundation('close');
}

export { 
    pickBasekit,
    chooseBasekit,
}