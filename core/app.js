import {
    db
} from '../page_scripts/firebase_api_littleguys.js';
import {
    attachEvent
} from './utils.js';

const appVersion = "1.0";
$(document).ready(start);

function start() {
    document.appVersion = appVersion;
    $("#topBar-container").load("top_bar.html", attachEventWrapper);

    firebase.auth().onAuthStateChanged(function (user) {
        let isUserSignedIn;
        if (user) {
            console.log("User is signed in");
            isUserSignedIn = true;
        } else {
            console.log("No user signed in yet.");
            isUserSignedIn = false;
        }
        setNavItemsVisibility(isUserSignedIn);
    });
}

let attachEventWrapper = (res) => attachEvent("submit", "searchBar", onSubmitted);

function onSubmitted(event) {
    console.log("submitted");
}

function setNavItemsVisibility(isUserLoggedIn) {
    let navProfile = document.getElementById('navProfile');
    let navLogin = document.getElementById('navLogin');
    let navLogout = document.getElementById('navLogout');

    navProfile.style.display = isUserLoggedIn ? "block" : "none";
    navLogout.style.display = isUserLoggedIn ? "block" : "none";
    navLogin.style.display = !isUserLoggedIn ? "block" : "none";
}