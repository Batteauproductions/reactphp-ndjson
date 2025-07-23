import { sortDatabase, resetDatabasesort } from "./search_functions.js";

$(document).ready(function() {

    $('#form-sort_skill').on('submit', function(e) {
        e.preventDefault();
        sortDatabase('skill', this);
    });

    $('#clear-form').on('click', function(e) {
        e.preventDefault();
        resetDatabasesort('skill', this);
    });

});