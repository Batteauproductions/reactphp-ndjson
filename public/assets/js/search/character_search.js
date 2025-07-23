import { sortDatabase, resetDatabasesort } from "./search_functions.js";

$(document).ready(function() {

    $('#form-sort_character').on('submit', function(e) {
        e.preventDefault();
        sortDatabase('character', this);
    });

    $('#clear-form').on('click', function(e) {
        e.preventDefault();
        resetDatabasesort('character', this);
    });

    //shows the character information in the form of a pop-up
    $('#sort_character-result').on('click', 'a[data-action="character-review"]', function(e) {
        e.preventDefault();
        const $modal = $('#character_process-modal');
        const $form = $('#form-character-check');
        const char_id = $(this).data('id');
        $form.find('input[name="cid"]').val(char_id);
        $modal.foundation('open');
    });

});