import { oCharacter } from '../generator.js';
import { openTextModal } from './modal/text_modal.js';
import { debugLog } from './functions.js';
import { domain, oTranslations, language, icons } from './settings.js';

function changeStatus() {
    openTextModal('status',$('#text-modal'));
}

function chooseStatus() {
    const $element = $('select[name="character-status"]  option:selected');
    oCharacter.setStatus($element.val());
    $('#characterstatus').html(`<i class="fa-solid fa-rotate-right"></i>${$element.data('name')}</span>`).on('click',changeStatus);   
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
                }));
                $options.push($option);
            });
            const $dropdown = ($('<select>', { 
                id: 'character-status', 
                name: 'character-status', 
                html: $options,
            }));
            console.log($dropdown);
            contentElements.push($dropdown); 
            
            contentElements.push($('<a>', { 
                class: 'button solid','data-action': `status-choose`,
                html: `${icons.choose.icon} ${icons.choose.text}`
            }).on('click', function(e) {
                e.preventDefault();
                chooseStatus();
            })); 
            
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