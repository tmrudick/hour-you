function updateOptions(type) {
    if (type === 'State') {
        document.getElementById('state').style.display = 'block';
        document.getElementById('other').style.display = 'none';
    } else if (type === 'Other') {
        document.getElementById('state').style.display = 'none';
        document.getElementById('other').style.display = 'block';
    } else {
        document.getElementById('state').style.display = 'none';
        document.getElementById('other').style.display = 'none';
    }
}

// Load the options when the page loads
chrome.extension.sendRequest({ name: 'options' }, function(response) {
    // Update the view based on the type
    updateOptions(response.type);

    // Update all of the fields to have the previously set values
    document.getElementById('type-dropdown').value = response.type;
    document.getElementById('other-text').value = response.other;
    document.getElementById('state-dropdown').value = response.state;
});

// When the save button is clicked, update the saved values
document.getElementById('saveBtn').onclick = function() {
    chrome.extension.sendRequest({ name: 'set', options: {
        type: document.getElementById('type-dropdown').value,
        state: document.getElementById('state-dropdown').value,
        other: document.getElementById('other-text').value
    }}, function() {
        document.getElementById('status').style.display = 'block';
        document.getElementById('status').innerHTML = 'Saved Options!';
    });
};

// When the type dropdown changes, update the DOM
document.getElementById('type-dropdown').addEventListener('change', function(event) {
    updateOptions(event.target.value);
});

// Prevent flicker
document.getElementById('state').style.display = 'none';
document.getElementById('other').style.display = 'none';
document.getElementById('status').style.display = 'none';