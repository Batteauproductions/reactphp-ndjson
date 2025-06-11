(function($) {
    $.fn.initSortable = function(options) {
        // Default settings
        const defaults = {
            tileSelector: '.tile',
            cookieName: 'filters',
            cookieExpiryDays: 7
        };

        // Extend the default options with the provided options
        const settings = $.extend({}, defaults, options);

        return this.each(function() {
            $(this).on('submit', function(event) {
                event.preventDefault();
                let filters = {};

                $(this).find('input, select').each(function() {
                    if ($(this).val() !== '') {
                        const filterValue = $(this).val();
                        const filterAttribute = $(this).attr('name');
                        filters[filterAttribute] = filterValue;
                    }
                });

                const queryString = $.param(filters);
                const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + queryString;
                window.history.pushState({ path: newUrl }, '', newUrl);

                const date = new Date();
                date.setTime(date.getTime() + (settings.cookieExpiryDays * 24 * 60 * 60 * 1000));
                const expires = "expires=" + date.toUTCString();
                document.cookie = settings.cookieName + "=" + encodeURIComponent(queryString) + ";" + expires + ";path=/";

                $(settings.tileSelector).hide();
                $(settings.tileSelector).each(function() {
                    let matchAllFilters = true;
                    const tile = $(this);
                    $.each(filters, function(attribute, value) {
                        if (tile[0].dataset[attribute] !== value) {
                            matchAllFilters = false;
                            return false;
                        }
                    });
                    if (matchAllFilters) {
                        $(this).show();
                    }
                });
            });
        });
    };
})(jQuery);