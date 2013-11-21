/**
 * Fetches and stores options from localStorage for the rest of the extension.
 *
 * Also handles disabling and enabling the extension from the toolbar.
 **/

// List the icon sizes for enabled and disabled states
var icons = {
    enabled: {
        '19': '/img/clock19.png',
        '38': '/img/clock38.png'
    },
    disabled: {
        '19': '/img/clock_off19.png',
        '38': '/img/clock_off38.png'
    }
}

// Set defaults for the very first time the extension is run
if (!localStorage.getItem('options')) {
    localStorage.setItem('options', JSON.stringify({
        mode: 'enabled',
        type: 'Federal',
        state: Object.keys(wages.state)[0],
        other: wages.federal
    }));
}

// Deal with the icon in the toolbar being clicked
chrome.browserAction.onClicked.addListener(function(tab) {
    var options = JSON.parse(localStorage.getItem('options'));

    // Toggle enabled/disabled in settings and icons
    if (options.mode === 'enabled') {
        options.mode = 'disabled';
        chrome.browserAction.setIcon({ path: icons.disabled });
    } else {
        options.mode = 'enabled';
        chrome.browserAction.setIcon({ path: icons.enabled });
    }

    localStorage.setItem('options', JSON.stringify(options));
});

// Handle requests from other scripts in the extension
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    // Always fetch the options from localStorage
    var options = JSON.parse(localStorage.getItem('options'));

    // Merge options objects if we have request.options
    if (request.options) {
        for (var option in request.options) {
            options[option] = request.options[option];
        }
    }

    // If this was a request to set, then save the data
    if (request.name == 'set') {
        localStorage.setItem('options', JSON.stringify(options));
    }

    // Always send the options back for evey request
    sendResponse(options);
});
