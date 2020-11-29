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

let currentUser = () => {
    return firebase.auth().currentUser;
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        fillFormWithData(user);
    }
})

$(document).ready(start);

function start() {
    attachEvent("submit", "profileForm", onSubmitted);
    configAutoComplete();
    $('#successToast').toast({
        // configuring toast to stay for 3 sec
        delay: 3000
    });
}

function onSubmitted(event) {
    let form = getElemById("profileForm");
    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
    }

    let email = currentUser.email;
    let oldPw = getElemById('oldPasswordField').value;
    let credential = firebase.auth.EmailAuthProvider.credential(email, oldPw);

    if (!isSearchValid) {
        console.log("asd");
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

function updateUser(params) {
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
    const form = getElemById("profileForm");
    form.classList.add('was-validated');
}

function fillFormWithData(user) {
    getUser(user.uid, (snap) => {
        let userData = snap.data();
        getElemById('emailField').value = userData.email;
        getElemById('searchInput').value = userData.location;
    });
}

function getUser(userId, callBack) {
    let userRef = db.collection('users').doc(userId);
    userRef.get().then(callBack);
}