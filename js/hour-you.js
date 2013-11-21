/**
 * Content script which will walk the DOM and replace occurances of $money with hours.
 *
 * Can be disabled via the toolbar.
 **/

// Simple regex to match US currency
var dollarRegEx = new RegExp(/\$(\d{1,3}(,?\d{3})*(\.\d\d)?)/g);

// Function to replace dollars in a string of text with hours
function updateText(text, wage) {
    var match = dollarRegEx.exec(text);

    if (match) {
        var amount = +match[1].replace(/,/g, ''),
            hours = amount / wage;

        // Replace the currency with an hours string keeping everything else the same
        return text.replace(dollarRegEx, hours.toFixed(1) + ' hours');
    }

    // Always return some text. Will return the original text if there isn't a match
    return text;
}

// Walk the DOM and call updateText on every text node
function updateDom(element, wage) {
    var walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    while (walker.nextNode()) {
        var current = walker.currentNode;
        current.textContent = updateText(current.textContent, wage);
    }
}

// Get the options from localStorage and decide what to do
chrome.extension.sendRequest({ name: "options" }, function(response) {
    // Check if we are currently enabled
    if (response.mode === 'enabled') {
        // Based on the type, calculate the hourly wage to use
        var wage = response.other;
        if (response.type === 'Federal') {
            wage = wages.federal;
        } else if (response.type === 'State') {
            wage = wages.state[response.state];
        }

        // Wagify the current DOM
        updateDom(document.body, wage);

        // Get ready for more additions to the DOM and wagify those too!
        document.body.addEventListener('DOMNodeInserted', function(event) {
            updateDom(event.target, wage);
        });
    }
});
