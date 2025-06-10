import { openTextModal } from './modal/text_modal.js';
import { debugLog } from './functions.js';
import { domain, oTranslations, language, icons } from './settings.js';

function changeStatus() {
    openTextModal('status',$('#text-modal'));
}

function chooseStatus() {
    const $element = $('select[name="character-status"]  option:selected');
    window.character.setStatus($element.data('name'),$element.val());
    $('#text-modal').foundation('close');
}

function pickStatus() {
    //-- collect the available options for the dropdown
    $.ajax({
        url: `${domain}/action/get-dropdown`,
        type: 'POST',
        dataType: 'json',
        data: {
            action: `fill-dropdown-status`,
        },
        success: function(data) {
            debugLog('pickStatus[data]', data);

            let contentElements = [];
            contentElements.push($('<label>', { 
                for: 'character-status', 
                text: oTranslations[language].character_status 
            }));
            
            let $options = [];
            //loop through the data collected
            $.each(data, function(index, value) {
                const $option = ($('<option>', { 
                    id: `status-${index}`,
                    value: `${value.id}`, 
                    text: `${value.name} | ${value.description}`,
                    'data-name': `${value.name}`,
                    selected: value.id == window.character.meta.status ? true : undefined
                }));
                $options.push($option);
            });
            const $dropdown = ($('<select>', { 
                id: 'character-status', 
                name: 'character-status', 
                html: $options,
            }));
            contentElements.push($dropdown); 
            contentElements.push(icons.choose.render(chooseStatus,true,''));
            openTextModal(contentElements);
        },
        error: function(error) {
            console.error('pickStatus: Error fetching data:', error);
        }
    });   
}

export {
    changeStatus,
    chooseStatus,
    pickStatus,
}