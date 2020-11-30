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
    isSelectionValid,
    getCity
} from '../core/autocomplete.js';

const formId = "profileForm";

const inputsToToggle = [];
$(document).ready(start);

function start() {
    attachEvent("submit", formId, onSubmitted);

    configAutoComplete();
    configInputs();
    let toast = getElemById('successToast');
    $(toast).toast({
        // configuring toast to stay for 3 sec
        delay: 3000
    });
    $(toast).on('hidden.bs.toast', () => toast.style.zIndex = -1);
}

let currentUser;
firebase.auth().onAuthStateChanged(authStateChanged);
async function authStateChanged(user) {
    if (user) {
        currentUser = user;

        // using async function above and await here 
        // so the loading would run after the db aync calls
        await fillFormWithData(user);
    }

    document.onLoadingDone(formId);
}

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

async function onSubmitted(event) {
    event.preventDefault();
    event.stopPropagation();

    setFormSubmitionAccess(false);

    let anyEmptyInputs = inputsToToggle.find(elem => elem.value !== "") == undefined;
    if (!anyEmptyInputs && !isSelectionValid) {
        let searchField = getElemById(searchInputId);
        searchField.classList.add('is-invalid');
        setFormSubmitionAccess(true);
        return;
    }

    await updateUser();

    afterProfileSaved();
}

async function updateUser() {
    await db.collection('users').doc(currentUser.uid)
        .update({
            location: getCity()
        })
        .then()
        .catch(error => console.log(error));
}

function afterProfileSaved() {
    let toast = getElemById('successToast');
    toast.style.zIndex = 0;
    $(toast).toast('show');

    setFormSubmitionAccess(true);
}

async function fillFormWithData(user) {
    let snap = await getUserFromDb(user.uid);
    fillForm(snap);
}

async function getUserFromDb(userId) {
    let userRef = db.collection('users').doc(userId);
    return await userRef.get();
}

function fillForm(snap) {
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