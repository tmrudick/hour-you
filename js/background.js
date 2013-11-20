// Set defaults for the very first time

if (!localStorage.getItem('options')) {
    localStorage.setItem('options', JSON.stringify({
        mode: 'hours',
        type: 'federal',
        state: Object.keys(wages.state)[0],
        other: wages.federal
    }))
}

chrome.browserAction.onClicked.addListener(function(tab) {
    var options = JSON.parse(localStorage.getItem('options'));

    if (options.mode === 'hours') {
        options.mode = 'money';
        chrome.browserAction.setIcon({ path: '/img/money.png' });
    } else {
        options.mode = 'hours';
        chrome.browserAction.setIcon({ path: '/img/clock.png'});
    }

    localStorage.setItem('options', JSON.stringify(options));
});

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
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

    sendResponse(options);
});