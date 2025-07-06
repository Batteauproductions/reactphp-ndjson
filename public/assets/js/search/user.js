import { sortDatabase, resetDatabasesort, deleteDatabaseElement } from "./_functions.js";

$(document).ready(function() {

    $('#form-sort_user').on('submit', function(e) {
        e.preventDefault();
        sortDatabase('user', this);
    });

    $('#clear-form').on('click', function(e) {
        e.preventDefault();
        resetDatabasesort('user', this);
    });

    //shows a pop-up before performin the delete action, making sure this isn't done on accident
    $('#sort_character-result').on('click', 'a[data-action="user-delete"]', function(e) {
        e.preventDefault();
        deleteDatabaseElement('user', this);
    });

});