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
    document.userLocKey = "user-location";
    $("#topBar-container").load("top_bar.html", attachEventWrapper);

    firebase.auth()
        .onAuthStateChanged(function (user) {
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
        });
}

function uploadUserLocation(uid) {
    let userRef = db.collection('users').doc(uid);

    let updateUserData = function (doc) {
        let userDoc = doc.data();
        let storageLoc = localStorage.getItem(document.userLocKey);
        
        if (doc.exists && !userDoc.location && storageLoc) {
            console.log("Updating user location since it's the first login");

            userRef.update({
                location: storageLoc
            });
        }
    }
    
    userRef.get().then(updateUserData)
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