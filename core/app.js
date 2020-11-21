function build() {
    $("#topBar-container").load("top_bar.html",
        (res) => attachEvent("submit", "searchBar", onSubmitted));
}

function onSubmitted(event) {
    console.log("submitted");
}

function attachEvent(eventName, elementid, func) {
    let element = document.getElementById(elementid);
    element.addEventListener(eventName, func);
}


$(document).ready(build);