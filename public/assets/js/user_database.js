import { showPopup } from './_lib/functions.js';
import { oTranslations, language, domain } from './_lib/settings.js';

$(document).ready(function() {
    $('a[data-action="user-delete"]').on('click', function(e) {
        const user_id = $(this).data('id');
        const $modal = $('#popup-modal');
        showPopup(
            `<p>${oTranslations[language].user_delete}</p>`,
            'confirm',
            'question',
            function() {                
                $.ajax({
                    url: `${domain}/admin/character-delete`,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        action: 'delete',
                        character: user_id
                    },
                    success: function(data) {
                        $(`div[data-character_id="${char_id}"]`).remove();
                        $modal.foundation('close');
                    },
                    error: function() {
                        const popupText = oTranslations[language].character_error;
                        showPopup(`<p>${popupText}</p>`, 'inform', 'error',$modal.foundation('close'));
                        console.error(popupText);
                    }
                });
            }
        );
    });
});