import {
    getElemById,
    attachEvent
} from '../core/utils.js';

let currentUser;
const inputsToToggle = [];
const formId = 'pwChangeForm';
$(document).ready(start);

function start() {
    attachEvent("submit", formId, submitFormAsync);

    configInputs();
    configToast();
}

firebase.auth().onAuthStateChanged(handleAuthAsync);
async function handleAuthAsync(user) {
    if (user) {
        currentUser = user;
    }

    document.hideLoader();
}

function configInputs() {
    let inputs = document.getElementsByTagName('input')

    for (const element of inputs) {
        element.addEventListener('input', clearFormInvalidMarks);
        inputsToToggle.push(element);
    }
}

function configToast() {
    let toast = getElemById('successToast');
    $(toast).toast({
        // configuring toast to stay for 3 sec
        delay: 3000
    });
    $(toast).on('hidden.bs.toast', () => toast.style.zIndex = -1);
}

function clearFormInvalidMarks(event) {
    getElemById(formId).classList.remove('was-validated');
}

async function submitFormAsync(event) {
    event.preventDefault();
    event.stopPropagation();

    setFormSubmitionAccess(false);

    let credential = firebase.auth
        .EmailAuthProvider
        .credential(currentUser.email, getElemById('oldPasswordField').value);

    await currentUser.reauthenticateWithCredential(credential)
        .catch(onReAuthenticateError);
    await updatePwAsync();
}

async function updatePwAsync() {
    await currentUser.updatePassword(getElemById('passwordField').value)
        .then(afterFormSaved)
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

function afterFormSaved() {
    let toast = getElemById('successToast');
    toast.style.zIndex = 0;
    $(toast).toast('show');
    setFormSubmitionAccess(true);
}

function setFormSubmitionAccess(turnOn) {
    let spinner = getElemById('pageSpinner');
    spinner.hidden = turnOn === true;
    inputsToToggle.forEach(elem => elem.disabled = turnOn === false);
}