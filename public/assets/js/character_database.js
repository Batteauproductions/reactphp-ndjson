import { showPopup } from './_lib/functions.js';
import { oTranslations, language, domain } from './_lib/settings.js';

$(document).ready(function() {

    //shows the character information in the form of a pop-up
    $('a[data-action="character-review"]').on('click', function(e) {
        e.preventDefault();
        const char_id = $(this).data('id');
        const $modal = $('#popup-modal');
        showPopup(
            `<p>${oTranslations[language].character_review}</p>`,
            'confirm',
            'question',
            function() {                
                $.ajax({
                    url: `${domain}/action/character-transfer`,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        action: 'review',
                        character: char_id
                    },
                    success: function(data) {
                        $(`div[data-character_id="${char_id}"]`).remove();
                        $modal.foundation('close');
                    },
                    error: function() {
                        const popupText = oTranslations[language].character_error;
                        showPopup(`<p>${popupText}</p>`, 'inform', 'error',function(){$modal.foundation('close')});
                        console.error(popupText);
                    }
                });
            }
        );
    });

    //shows a pop-up before performin the delete action, making sure this isn't done on accident
    $('a[data-action="character-delete"]').on('click', function(e) {
        e.preventDefault();
        const char_id = $(this).data('id');
        const $modal = $('#popup-modal');
        showPopup(
            `<p>${oTranslations[language].character_delete}</p>`,
            'confirm',
            'question',
            function() {                
                $.ajax({
                    url: `${domain}/action/character-transfer`,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        action: 'delete',
                        character: char_id
                    },
                    success: function(data) {
                        $(`div[data-character_id="${char_id}"]`).remove();
                        $modal.foundation('close');
                    },
                    error: function() {
                        const popupText = oTranslations[language].character_error;
                        showPopup(`<p>${popupText}</p>`, 'inform', 'error',function(){$modal.foundation('close')});
                        console.error(popupText);
                    }
                });
            }
        );
    });
});