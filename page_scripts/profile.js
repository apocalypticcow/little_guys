import {
    db
} from '../page_scripts/firebase_api_littleguys.js';
import {
    getElemById,
    attachEvent
} from '../core/utils.js';
import {
    validList,
    searchInputId,
    configAutoComplete,
    isSelectionValid
} from '../core/autocomplete.js';

const formId = "profileForm";

const inputsToToggle = [];
$(document).ready(start);

function start() {
    attachEvent("submit", formId, onSubmitted);

    configAutoComplete();
    configInputs();
    $('#successToast').toast({
        // configuring toast to stay for 3 sec
        delay: 3000
    });
}

let currentUser;
firebase.auth().onAuthStateChanged(async function (user) {
    if (user) {
        currentUser = user;

        // using async function above and await here 
        // so the loading would run after the db aync calls
        await fillFormWithData(user);
    }

    document.onLoadingDone(formId);
})

function configInputs() {
    let inputs = document.getElementsByTagName('input')

    for (const element of inputs) {
        if (element.type !== 'email') {
            element.addEventListener('input', clearFormInvalidMarks);
            inputsToToggle.push(element);
        }
    }
}

function clearFormInvalidMarks(event) {
    getElemById(formId).classList.remove('was-validated');
    if (event.target.id === searchInputId) {
        let searchField = getElemById(searchInputId);
        searchField.classList.remove('is-invalid');
    }
}

function setFormSubmitionAccess(turnOn) {
    let spinner = getElemById('pageSpinner');
    spinner.hidden = turnOn === true;
    inputsToToggle.forEach(elem => {
        elem.disabled = turnOn === false;
    });
}

function onSubmitted(event) {

    let form = getElemById(formId);
    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
    }

    setFormSubmitionAccess(false);

    let credential = firebase.auth
        .EmailAuthProvider
        .credential(currentUser.email, getElemById('oldPasswordField').value);

    let anyEmptyInputs = inputsToToggle.find(elem => elem.value !== "") == undefined;
    if (!anyEmptyInputs && !isSelectionValid) {
        let searchField = getElemById(searchInputId);
        searchField.classList.add('is-invalid');
        setFormSubmitionAccess(true);
        return;
    }

    currentUser.reauthenticateWithCredential(credential)
        .then(updatePw)
        .catch(onReAuthenticateError);
}

function updatePw() {
    currentUser.updatePassword(getElemById('passwordField').value)
        .then(updateUser)
        .catch(onPwUpdateError);
}

function onReAuthenticateError(error) {
    showInvalid(error.message, 'oldPasswordField', 'old-pw-feedback');

    const pwField = getElemById('passwordField');

    let errorMsg = pwField.value.length === 0 ? "Password must not be empty." : " ";
    showInvalid(errorMsg, 'passwordField', 'pw-feedback');

}

function onPwUpdateError(error) {
    // we need to clear it old pw field validity like this, 
    // so we won't confusingly give negative feedback to the 
    // user using their old pw
    getElemById('oldPasswordField').setCustomValidity("");

    showInvalid(error.message, 'passwordField', 'pw-feedback');
}

function updateUser() {
    currentUser.updateProfile({
            location: getElemById('searchInput').value
        })
        .then(onPageSaveSuccess);
}

function onPageSaveSuccess() {
    $('#successToast').toast('show');
    setFormSubmitionAccess(true);
}

function showInvalid(message, fieldId, feedbackId) {
    const pwField = getElemById(fieldId);
    pwField.setCustomValidity(message);
    const pwValidFeedback = getElemById(feedbackId);
    pwValidFeedback.innerText = message;
    onFormValidated();
}

function onFormValidated() {
    const form = getElemById(formId);
    form.classList.add('was-validated');
    setFormSubmitionAccess(true);
}

async function fillFormWithData(user) {
    await getUserFromDb(user.uid);
}

async function getUserFromDb(userId) {
    let userRef = db.collection('users').doc(userId);
    await userRef.get().then(afterGet);
}

async function afterGet(snap) {
    let userData = snap.data();

    getElemById('emailField').value = userData.email;

    if (userData.location) {
        let searchInput = getElemById(searchInputId);

        // the autocomplete state hacking
        searchInput.value = userData.location;
        validList.push(userData.location);

        // manually trigger the event
        searchInput.dispatchEvent(new Event("change"));
    }
}