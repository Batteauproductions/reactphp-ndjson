import { oCharacter } from '../generator.js';
import { openTextModal } from './modal/text_modal.js';
import { updateCharacter } from './character.js';
import { debugLog } from './functions.js';
import { domain, oTranslations, language, icons } from './settings.js';

function changeType() {
    openTextModal('type',$('#text-modal'));
}

function chooseType() {
    const $element = $('select[name="character-type"]  option:selected');
    oCharacter.setType($element.val());
    $('#charactertype').html(`<i class="fa-solid fa-rotate-right"></i>${$element.data('name')}</span>`).on('click',changeType);   
    $('#text-modal').foundation('close');
    updateCharacter();
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
            
            contentElements.push($('<a>', { 
                class: 'button solid','data-action': `type-choose`,
                html: `${icons.choose.icon} ${icons.choose.text}`
            }).on('click', function(e) {
                e.preventDefault();
                chooseType();
            })); 

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