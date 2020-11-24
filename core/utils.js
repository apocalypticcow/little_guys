
function attachEvent(eventName, elementid, func) {
    let element = document.getElementById(elementid);
    element.addEventListener(eventName, func);
}

function onSubmitted(event) {
    console.log("submitted");
}

function createElem(elemName, classNames, attributesObj) {
    let elem = document.createElement(elemName);
    let $elem = $(elem);
    $elem.addClass(classNames);
    setAttribute(elem, attributesObj);
    return elem;
}

function createJQueryElem(elemName, classNames, attributesObj) {
    let $elem = $(createElem(elemName, attributesObj));
    $elem.addClass(classNames);
    return $elem;
}

function setAttribute(el, attrs) {
    for (const key in attrs) {
        if (attrs.hasOwnProperty(key)) {
            el.setAttribute(key, attrs[key]);
        }
    }
}

export{
    attachEvent,
    onSubmitted,
    createElem,
    createJQueryElem,
    setAttribute
}