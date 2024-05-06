$('.sortable').on('submit', function (event){
    event.preventDefault(); // Prevent default form submission
        
    let filters = {}; // Object to store filters
    
    // Iterate through each input field
    $(this).find('input, select').each(function() {
        // Check if the field is not empty
        if ($(this).val() !== '') {
            // Get filter value and attribute
            var filterValue = $(this).val();
            var filterAttribute = $(this).attr('name');
            filters[filterAttribute] = filterValue; // Store filter in object
        }
    });
    
    // Hide all tiles initially
    $('.tile').hide();
    
    // Iterate through each tile
    $('.tile').each(function() {
        var matchAllFilters = true;
        // Check if the tile matches all filters
        var tile = $(this);
        $.each(filters, function(attribute, value) {
            if (tile[0].dataset[attribute] !== value) { // Access dataset directly
                matchAllFilters = false;
                return false; // Exit loop if any filter doesn't match
            }
        });
        if (matchAllFilters) {
            $(this).show(); // Show tile if it matches all filters
        }
    });
});
