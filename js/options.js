function getWageType() {
    var radios = document.getElementsByName('wageType');

    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
}

function setWageType(value) {
    var radios = document.getElementsByName('wageType');

    for (var i = 0; i < radios.length; i++) {
        if (radios[i].value === value) {
            radios[i].checked = true;
            break;
        }
    }
}

chrome.extension.sendRequest({ name: 'options' }, function(response) {
    setWageType(response.type || 'federal');

    document.getElementById('other').value = response.other;
    document.getElementById('state').value = response.state;
});

document.getElementById('saveBtn').onclick = function() {
    chrome.extension.sendRequest({ name: 'set', options: {
        type: getWageType(),
        state: document.getElementById('state').value,
        other: document.getElementById('other').value
    }}, function() {
        document.getElementById('status').text = 'Saved!';
    });
};