import {
    db
} from '../page_scripts/firebase_api_littleguys.js';
import {
    getElemById,
    attachEvent
} from '../core/utils.js';
import {
    configAutoComplete,
    isSearchValid
} from '../core/autocomplete.js';

var appVersion;
const formId = "profileForm";

let currentUser;


$(document).ready(start);

function start() {
    attachEvent("submit", formId, onSubmitted);

    configAutoComplete();

    $('#successToast').toast({
        // configuring toast to stay for 3 sec
        delay: 3000
    });
}

firebase.auth().onAuthStateChanged(async function (user) {
    if (user) {
        currentUser = user;
        await fillFormWithData(user);
    }
    
    document.onLoadingDone(formId);
})

function onSubmitted(event) {
    let form = getElemById(formId);
    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
    }

    let email = currentUser.email;
    console.log()
    let oldPw = getElemById('oldPasswordField').value;
    let credential = firebase.auth.EmailAuthProvider.credential(email, oldPw);

    if (!isSearchValid) {
        onFormValidated();
        return;
    }

    currentUser.reauthenticateWithCredential(credential)
        .then(updatePw)
        .catch(onReAuthenticateError);
}

function onReAuthenticateError(error) {
    showInvalidity(error.message, 'oldPasswordField', 'old-pw-feedback');

    const pwField = getElemById('passwordField');

    if (!pwField.value || pwField.value.length > 0) {
        showInvalidity("Password must not be empty.", 'passwordField', 'pw-feedback')
    }
}

function updatePw() {
    currentUser.updatePassword(getElemById('passwordField').value)
        .then(updateUser)
        .catch(onPwUpdateError);
}

function onPwUpdateError(error) {
    showInvalidity(error.message, 'passwordField', 'pw-feedback');
}

function updateUser() {
    currentUser.update({
            location: getElemById('searchInput').value
        })
        .then(onPageSaveSuccess);
}

function onPageSaveSuccess() {
    $('#successToast').toast('show');
}

function showInvalidity(message, fieldId, feedbackId) {
    const pwField = getElemById(fieldId);
    pwField.setCustomValidity(message);
    const pwValidFeedback = getElemById(feedbackId);
    pwValidFeedback.innerText = message;
    onFormValidated();
}

function onFormValidated() {
    const form = getElemById(formId);
    form.classList.add('was-validated');
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
    getElemById('searchInput').value = userData.location;
    return Promise.resolve();
}