import {
    db
} from '../page_scripts/firebase_api_littleguys.js';
import {
    getElemById,
    attachEvent
} from '../core/utils.js';
import {
    validList,
    configAutoComplete,
    searchInputId
} from '../core/autocomplete.js';

const submitBtn = document.getElementById("submitBtn");
let userId;
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        userId = user.uid;
        fillFormWithData(user);
    }
})

$(document).ready(start);

function start() {
    attachEvent("change", searchInputId, onChanged);
    attachEvent("submit", "profileForm", onSubmitted);
    configAutoComplete(onSelected);

    $('#successToast').toast({
        delay: 3000
    });
}

function onChanged(event) {
    // target is the element triggered this event
    let input = event.target;

    // set canSubmit so submit button can be set to enabled
    submitBtn.disabled = !validList.includes(input.value);
}

function onSelected(event, item) {
    // item here is the selected value
    submitBtn.disabled = !validList.includes(item);
}

function onSubmitted(event) {
    event.preventDefault();
    const form = getElemById("profileForm");
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }

    const oldField = getElemById('oldPasswordField');

    let user = firebase.auth().currentUser;

    let credential = firebase.auth.EmailAuthProvider.credential(user.email, oldField.value);

    const updateUser = () =>
        user.update({
            location: getElemById('searchInput').value
        }).then(onSaveSuccess);

    const pwField = getElemById('passwordField');
    const updatePw = () => user.updatePassword(pwField.value)
        .then(updateUser)
        .catch((error) => showInvalidity(error.message, 'passwordField', 'pw-feedback'));

    user.reauthenticateWithCredential(credential)
        .then(updatePw)
        .catch((error) => {
            showInvalidity(error.message, 'oldPasswordField', 'old-pw-feedback');

            if (!pwField.value || pwField.value.length > 0) {
                showInvalidity("Password must not be empty.", 'passwordField', 'pw-feedback')
            }
        });

}
function onSaveSuccess() {
    $('#successToast').toast('show');
}

function showInvalidity(message, fieldId, feedbackId) {
    const form = getElemById("profileForm");
    const pwField = getElemById(fieldId);
    pwField.setCustomValidity(message);
    const pwValidFeedback = getElemById(feedbackId);
    pwValidFeedback.innerText = message;
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