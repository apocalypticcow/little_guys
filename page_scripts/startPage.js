import {
    attachEvent,
    getElemById
} from '../core/utils.js';

import {
    validList,
    configAutoComplete,
    searchInputId
} from '../core/autocomplete.js';

const searchInput = getElemById(searchInputId);
const formId = "searchForm";
const form = getElemById(formId);
const locFeedback = getElemById('loc-feedback');
let formInvalid = true;

function start() {
    searchInput.focus();

    attachEvent("change", searchInputId, onChanged);
    attachEvent("submit", formId, onSubmitted);
    configAutoComplete(onSelected);
}

function onChanged(event) {
    // target is the element triggered this event
    let input = event.target;

    form.classList.remove('was-validated');
    locFeedback.innerText = "Location must be provided.";

    // set canSubmit so submit button can be set to enabled
    formInvalid = !validList.includes(input.value);
}

function onSelected(event, item) {
    // item here is the selected value
    formInvalid = !validList.includes(item);
}

function onSubmitted(event) {
    event.preventDefault();
    if (formInvalid) {
        searchInput.setCustomValidity("Please select an item from the list!");
        
        if (searchInput.value != "") {
            locFeedback.innerText = "Please select an item from the list!";
        }
        form.classList.add('was-validated');
    } else {
        localStorage.setItem(document.userLocKey, searchInput.value);
        window.location.href = '/home.html';
    }
}


$(document).ready(start);