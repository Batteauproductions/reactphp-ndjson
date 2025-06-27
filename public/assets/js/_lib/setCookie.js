function setCookieURL(data, formdata, name) {
    // Build URL query parameters and cookie filter values
    const urlParams = new URLSearchParams();
    const filtersOnly = {};

    formdata.forEach(function(item) {
        if (item.value) { // Only include fields with a value
            data[item.name] = item.value;
            filtersOnly[item.name] = item.value;
            urlParams.append(item.name, item.value);
        }
    });

    // Set cookie with filters only
    setCookie(name, JSON.stringify(filtersOnly), 7);

    // Update browser URL without reloading the page
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.pushState({}, '', newUrl);
}

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

export {
    setCookieURL
}