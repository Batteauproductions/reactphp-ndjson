import { openTextModal } from '../modal/text_modal.js';
import { debugLog } from '../../_lib/functions.js';
import { domain, oTranslations, language, icons } from '../../_lib/settings.js';

function changeType() {
    openTextModal('type',$('#text-modal'));
}

function chooseType() {
    const $element = $('select[name="character-type"]  option:selected');
    window.character.setType($element.data('name'),$element.val());
    $('#text-modal').foundation('close');
}

function pickType() {
    //-- collect the available options for the dropdown
    $.ajax({
        url: `${domain}/action/get-dropdown`,
        type: 'POST',
        dataType: 'json',
        data: {
            action: `fill-dropdown-type`,
        },
        success: function(data) {
            debugLog('pickType[data]', data);

            let contentElements = [];
            contentElements.push($('<label>', { 
                for: 'character-type', 
                text: oTranslations[language].character_type,                
            }));
            
            let $options = [];
            //loop through the data collected
            $.each(data, function(index, value) {
                const $option = ($('<option>', { 
                    id: `type-${index}`,
                    value: `${value.id}`, 
                    text: `${value.name} | ${value.description}`,
                    'data-name': `${value.name}`,
                    selected: value.id == window.character.meta.type ? true : undefined
                }));
                $options.push($option);
            });
            const $dropdown = ($('<select>', { 
                id: 'character-type', 
                name: 'character-type', 
                html: $options,
            }));
            console.log($dropdown);
            contentElements.push($dropdown); 
            contentElements.push(icons.choose.render(chooseType,true,''))
            openTextModal(contentElements);
        },
        error: function(error) {
            console.error('pickType: Error fetching data:', error);
        }
    }); 
}

export {
    pickType,
    chooseType,
    changeType,
}