import {
    attachEvent,
    getElemById
} from '../core/utils.js';

import {
    configAutoComplete,
    getInputId,
    locationValid,
    getSelected
} from '../core/autocomplete.js';

let searchInput = getElemById(getInputId());
let formId = "searchForm";
let form = getElemById(formId);

$(document).ready(start);
function start() {
    searchInput.focus();
    attachEvent("submit", formId, onSubmitted);
    configAutoComplete(onAutoCompleteChange);
    document.hideLoader();
}

function onAutoCompleteChange() {
    form.classList.remove('is-invalid');
}

function onSubmitted(event) {
    event.preventDefault();
    if (!locationValid) {
        let searchField = getElemById(getInputId());
        searchField.classList.add('is-invalid');
    } else {
        localStorage.setItem("user-location", getSelected());
        window.location.href = '/home.html';
    }
}
