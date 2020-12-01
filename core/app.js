import {
    db
} from '../page_scripts/firebase_api_littleguys.js';
import {
    getElemById
} from './utils.js';

const appVersion = "1.1";
document.appVersion = appVersion;
document.isUserSignedIn = false;

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
    document.isUserSignedIn = isUserSignedIn;
});

function start() {
    $("#topBar-container").load("top_bar.html", () => {
        console.log("Navbar loaded");
        setNavItemsVisibility(document.isUserSignedIn);
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
    } else {
        let href = window.location.pathname.replace("/", "");
        let selector = "a[href='" + href + "'].nav-link";
        let activeElem = document.querySelector(selector);
        activeElem.classList.add('active');
    }
}