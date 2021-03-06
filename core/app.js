import {
    db
} from '../page_scripts/firebase_api_littleguys.js';
import {
    getElemById,
    tryToAsync
} from './utils.js';

const appVersion = "1.4";
document.appVersion = appVersion;
document.isUserSignedIn = false;

let navBarLoaded = false;

$(document).ready(start);

firebase.auth().onAuthStateChanged(function (user) {
    let isUserSignedIn;
    if (user) {
        console.log("User is signed in");
        tryToAsync(uploadUserLocation, user.uid)
        isUserSignedIn = true;

    } else {
        console.log("No user signed in yet.");
        isUserSignedIn = false;
    }

    document.isUserSignedIn = isUserSignedIn;
    if (navBarLoaded) {
        tryToAsync(setNavItemsVisibility, document.isUserSignedIn);
    }
});

function start() {
    $("#topBar-container").load("top_bar.html", () => {
        console.log("Navbar loaded");
        navBarLoaded = true;
    });
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
    let navLocChange = getElemById('navLocChange');

    navProfile.hidden = !isUserLoggedIn;
    navLogout.hidden = !isUserLoggedIn;
    navLogin.hidden = isUserLoggedIn;
    navLocChange.hidden = isUserLoggedIn;
    changeActiveLink()
}

function changeActiveLink() {
    let isIndex = window.location.pathname === "/";
    if (isIndex) {
        let navLink = getElemById('navLocChange').firstElementChild;
        navLink.classList.add('active');
        return;
    }

    let href = window.location.pathname.replace("/", "");
    let selector = "a[href='" + href + "'].nav-link";

    let activeElem = document.querySelector(selector);
    if (activeElem) {
        activeElem.classList.add('active');
    }
}