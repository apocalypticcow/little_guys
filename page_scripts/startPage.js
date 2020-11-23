function build() {

}

function onSubmitted(event) {
    console.log("submitted");
}

function attachEvent(eventName, elementid, func) {
    let element = document.getElementById(elementid);
    element.addEventListener(eventName, func);
}


$(document).ready(build);