import {
    db
} from './firebase_api_littleguys.js';

function build() {
    prepareData();
}

$(document).ready(build);

function prepareData(shops) {
    let collRef = db.collection("shops");

    collRef.get().then((querySnapshot) => {
            querySnapshot.forEach(doc => {
                let card = buildListElem(doc.data());
                content.appendChild(card);
            });
        })
        .catch(() => {

        });
}

function buildListElem(shop) {
    let row = createElem("div", "row no-gutters");

    // let firstCol = createElem("div", "col mb-4");
    // let secondCol = createElem("div", "col mb-4");
    let firstCol = createElem("div", "col-sm-5");
    let secondCol = createElem("div", "col-sm-7");
    row.appendChild(firstCol);
    row.appendChild(secondCol);

    let cardImg = createElem("img", "card-img", {
        "src": "https://via.placeholder.com/150"
    });
    firstCol.appendChild(cardImg);

    let cardBody = createElem("div", "card-body");
    secondCol.appendChild(cardBody);

    let cardTitle = createElem("h5", "card-title");
    let cardText = createElem("p", "card-text");

    cardTitle.innerHTML = shop.name;
    cardText.innerHTML = shop.distance + "m; " + shop.openingHours + "; " + shop.totalRating;

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);

    let card = createElem("div", "card");
    card.appendChild(row);
    return card;
}

/////////////////////
// Utility methods //
/////////////////////

function onSubmitted(event) {
    console.log("submitted");
}

function attachEvent(eventName, elementid, func) {
    let element = document.getElementById(elementid);
    element.addEventListener(eventName, func);
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