import {
    db
} from '../page_scripts/firebase_api_littleguys.js';
import {
    getElemById
} from './utils.js';

async function onLoadingDone(contentToShowId) {
    const spinner = getElemById('pageSpinner');
    spinner.hidden = true;

    const form = getElemById(contentToShowId);
    form.hidden = false;
}

const appVersion = "1.0";
document.appVersion = appVersion;
document.onLoadingDone = onLoadingDone;

$(document).ready(start);
firebase.auth().onAuthStateChanged(function (user) {
    let isUserSignedIn;
    if (user) {
        console.log("User is signed in");
        uploadUserLocation(user.uid);
        isUserSignedIn = true;

    } else {
        console.log("No user signed in yet.");
        isUserSignedIn = false;
    }
    setNavItemsVisibility(isUserSignedIn);
    document.isUserSignedIn = isUserSignedIn;
});

function start() {
    $("#topBar-container").load("top_bar.html", () => console.log("Navbar loaded"));
}

function uploadUserLocation(uid) {
    let userRef = db.collection('users').doc(uid);

    let updateUserData = function (doc) {
        let userDoc = doc.data();
        let storageLoc = localStorage.getItem("user-location");

        if (doc.exists && !userDoc.location && storageLoc) {
            console.log("Updating user location since it's the first login");

            userRef.update({
                location: storageLoc
            });
        }
    }

    userRef.get().then(updateUserData);
}

function setNavItemsVisibility(isUserLoggedIn) {
    let navProfile = getElemById('navProfile');
    let navLogin = getElemById('navLogin');
    let navLogout = getElemById('navLogout');

    navProfile.hidden = !isUserLoggedIn;
    navLogout.hidden = !isUserLoggedIn;
    navLogin.hidden = isUserLoggedIn;
}