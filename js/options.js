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

chrome.extension.sendRequest({ name: 'getOptions' }, function(response) {
    console.log(response);
    setWageType(response.options.wageType || 'federal');

    document.getElementById('other').value = response.options.other || '7.25';
    document.getElementById('state').value = response.options.state || 'AL';
});

document.getElementById('saveBtn').onclick = function() {
    chrome.extension.sendRequest({ name: 'setOptions', options: {
        wageType: getWageType(),
        state: document.getElementById('state').value,
        other: document.getElementById('other').value
    }}, function() {
        //document.getElementById('status').text = 'Saved!';
    });
};