import { showPopup } from './_lib/functions.js';
import { oTranslations, language, domain } from './_lib/settings.js';
import { setCookieURL } from './_lib/setCookie.js';

$(document).ready(function() {

    //shows the character information in the form of a pop-up
    $('#sort_characters-result').on('click', 'a[data-action="character-review"]', function(e) {
        e.preventDefault();
        const $modal = $('#character_process-modal');
        const $form = $('#form-character-check');
        const char_id = $(this).data('id');
        $form.find('input[name="cid"]').val(char_id);
        $modal.foundation('open');
    });

    $('#clear-form').on('click', function() {
        const $modal = $('#popup-modal');
        // Clear all input fields (text, select, checkboxes, etc.)
        $('#form-sort_characters')[0].reset();
        // Manually reset Chosen dropdowns
        $('#form-sort_characters select').val('').trigger('chosen:updated');
        // Remove query parameters from the URL
        const baseUrl = window.location.pathname;
        window.history.pushState({}, '', baseUrl);

        // Submit the form with no data (only action: 'search')
        $.ajax({
            url: `${domain}/action/character-transfer`,
            type: 'POST',
            data: {
                action: 'search'
            },
            success: function(data) {
                $('#sort_characters-result').html(data);
            },
            error: function() {
                const popupText = oTranslations[language].system_error;
                showPopup(`<p>${popupText}</p>`, 'inform', 'error', function() {
                    $modal.foundation('close');
                });
                console.error(popupText);
            }
        });
    });

    $('#form-sort_characters').on('submit', function(e) {
        e.preventDefault();
        const $modal = $('#popup-modal');
        const formdata = $(this).serializeArray();
        const data = {
            action: 'search'
        };

        // Store filters in a cookie for 7 days        
        setCookieURL(data,formdata,'character_filters');

        // Perform the AJAX request
        $.ajax({
            url: `${domain}/action/character-transfer`,
            type: 'POST',
            data: data,
            success: function(data) {
                $('#sort_characters-result').html(data);
            },
            error: function() {
                const popupText = oTranslations[language].system_error;
                showPopup(`<p>${popupText}</p>`, 'inform', 'error', function() {
                    $modal.foundation('close');
                });
                console.error(popupText);
            }
        });
    });


    $('#form-character-check').on('submit', function(e){
        e.preventDefault();
        const formdata = $(this).serialize();
        $.ajax({
            url: `${domain}/action/character-transfer`,
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'process',
                data: formdata,
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
    });

    //shows a pop-up before performin the delete action, making sure this isn't done on accident
    $('#sort_characters-result').on('click', 'a[data-action="character-delete"]', function(e) {
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