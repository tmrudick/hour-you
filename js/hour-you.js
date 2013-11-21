var dollarRegEx = new RegExp(/\$(\d{1,3}(,?\d{3})*(\.\d\d)?)/g);

function wagifySomeText(text, wage) {
    var match = dollarRegEx.exec(text);

    if (match) {
        var amount = +match[1].replace(/,/g, '');

        var hours = amount / wage;

        return text.replace(dollarRegEx, hours.toFixed(1) + ' hours');
    }

    return text;
}

function wagifyTheDom(element, wage) {
    var walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    while (walker.nextNode()) {
        var current = walker.currentNode;
        current.textContent = wagifySomeText(current.textContent, wage);
    }
}

chrome.extension.sendRequest({ name: "options" }, function(response) {
    if (response.mode === 'hours') {
        // Get the wage
        var wage = response.other;
        if (response.type === 'Federal') {
            wage = wages.federal;
        } else if (response.type === 'State') {
            wage = wages.state[response.state];
        }

        // Wagify the current DOM
        wagifyTheDom(document.body, wage);

        // Get ready for more additions
        document.body.addEventListener('DOMNodeInserted', function(event) {
            wagifyTheDom(event.target, wage);
        });
    }
});
