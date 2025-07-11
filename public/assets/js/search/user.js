import { sortDatabase, resetDatabasesort } from "./_functions.js";

$(document).ready(function() {

    $('#form-sort_user').on('submit', function(e) {
        e.preventDefault();
        sortDatabase('user', this);
    });

    $('#clear-form').on('click', function(e) {
        e.preventDefault();
        resetDatabasesort('user', this);
    });

});