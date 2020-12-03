import {
    db
} from '../page_scripts/firebase_api_littleguys.js';
import {
    getElemById,
    attachEvent
} from '../core/utils.js';
import {
    updateInputVal,
    getInputId,
    configAutoComplete,
    locationValid,
    getSelected
} from '../core/autocomplete.js';

const formId = "profileForm";
const inputsToToggle = [];

$(document).ready(start);

function start() {
    attachEvent("submit", formId, submitAsync);

    configAutoComplete();
    configInputs();
    configToast();
}

firebase.auth().onAuthStateChanged(handleAuthAsync);

let currentUser;
async function handleAuthAsync(user) {
    if (user) {
        currentUser = user;

        // using async function above and await here 
        // so the loading would run after the db aync calls
        await fillFormAsync(user);
    }

    document.hideLoader();
}

function configInputs() {
    let inputs = document.getElementsByTagName('input');

    for (const inputElem of inputs) {
        if (inputElem.type !== 'email') {
            inputElem.addEventListener('input', clearFormInvalidMarks);
            inputsToToggle.push(inputElem);
        }
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
    if (event.target.id === getInputId) {
        let searchField = getElemById(getInputId);
        searchField.classList.remove('is-invalid');
    }
}

function setInputsAccess(turnOn) {
    // fade in-out spinner
    let $spinner = $(getElemById('pageSpinner'));
    !turnOn ? $spinner.fadeIn(speed) : $spinner.fadeOut(speed);
    
    // disabling-enabling inputs
    inputsToToggle.forEach(elem => elem.disabled = turnOn === false);
}

async function submitAsync(event) {
    event.preventDefault();
    event.stopPropagation();

    // disable inputs, show spinner
    setInputsAccess(false);

    // handle input validation
    if (!locationValid) {
        let searchField = getElemById(getInputId);
        searchField.classList.add('is-invalid');
        setInputsAccess(true);
        return;
    }
    
    // update
    await updateUserAsync();

    // post update functions
    afterProfileSaved();
    setInputsAccess(true);
}

async function updateUserAsync() {
    await db.collection('users').doc(currentUser.uid)
        .update({
            location: getSelected()
        })
        .catch(error => console.log(error));
}

function afterProfileSaved() {
    let toast = getElemById('successToast');
    toast.style.zIndex = 0;
    $(toast).toast('show');
}

async function fillFormAsync(user) {
    let snap = await getDbUserAsync(user.uid);
    fillForm(snap);
}

async function getDbUserAsync(userId) {
    let userRef = db.collection('users').doc(userId);
    return await userRef.get();
}

function fillForm(snap) {
    let userData = snap.data();

    getElemById('emailField').value = userData.email;

    if (userData.location) {
        updateInputVal(userData.location);
    }
}