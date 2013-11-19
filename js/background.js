
chrome.browserAction.onClicked.addListener(function(tab) {
    if (localStorage.getItem('mode') === 'hours') {
        localStorage.setItem('mode', 'money');
        chrome.browserAction.setIcon({ path: '/img/money.png' });
    } else {
        localStorage.setItem('mode', 'hours');
        chrome.browserAction.setIcon({ path: '/img/clock.png'} );
    }
});

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.name == 'getMode') {
        sendResponse({value: localStorage.getItem('mode') || 'hours' });
    }
});