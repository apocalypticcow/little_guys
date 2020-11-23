import { db } from '../page_scripts/firebase_api_littleguys.js';

let attachEventWrapper = (res) => attachEvent("submit", "searchBar", onSubmitted);
function start() {
    $("#topBar-container").load("top_bar.html", attachEventWrapper);
}


function onSubmitted(event) {
    console.log("submitted");
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log("User is signed in");
    } else {
        console.log("No user signed in yet.");
    }
});

function attachEvent(eventName, elementid, func) {
    let element = document.getElementById(elementid);
    element.addEventListener(eventName, func);
}


$(document).ready(start);