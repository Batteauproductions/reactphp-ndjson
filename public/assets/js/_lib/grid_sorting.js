(function($) {
    $.fn.initSortable = function(options) {
        const defaults = {
            tileSelector: '.tile',
            cookieName: 'filters',
            cookieExpiryDays: 7
        };

        const settings = $.extend({}, defaults, options);

        function applyFilters(filters) {
            // Set form inputs based on filters
            $('form').find('input, select').each(function() {
                const name = $(this).attr('name');
                if (filters[name]) {
                    $(this).val(filters[name]);
                }
            });

            // Show/hide tiles
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
                    tile.show();
                }
            });
        }

        function getFiltersFromUrl() {
            const params = new URLSearchParams(window.location.search);
            const filters = {};
            for (const [key, value] of params.entries()) {
                filters[key] = value;
            }
            return filters;
        }

        return this.each(function() {
            // 1. Auto-apply filters on page load
            const urlFilters = getFiltersFromUrl();
            if (Object.keys(urlFilters).length > 0) {
                applyFilters(urlFilters);
            }

            // 2. Handle form submission
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

                applyFilters(filters);
            });
        });
    };
})(jQuery);
