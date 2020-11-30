import {
    attachEvent,
    getElemById
} from '../core/utils.js';

import {
    configAutoComplete,
    searchInputId,
    isSelectionValid,
    getCity
} from '../core/autocomplete.js';

let searchInput = getElemById(searchInputId);
let formId = "searchForm";
let form = getElemById(formId);
let locFeedback = getElemById('loc-feedback');

function start() {
    searchInput.focus();
    attachEvent("submit", formId, onSubmitted);
    configAutoComplete(onAutoCompleteChange);
}

function onAutoCompleteChange(){
    form.classList.remove('was-validated');
    locFeedback.innerText = "Location must be provided.";
}

function onSubmitted(event) {
    event.preventDefault();
    if (!isSelectionValid) {
        searchInput.setCustomValidity("Please select an item from the list!");
        
        if (searchInput.value != "") {
            locFeedback.innerText = "Please select an item from the list!";
        }
        form.classList.add('was-validated');
    } else {
    localStorage.setItem(document.userLocKey, getCity());
        window.location.href = '/home.html';
    }
}

$(document).ready(start);