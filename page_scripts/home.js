import {
    db
} from './firebase_api_littleguys.js';
import {
    tryToAsync
} from '../core/utils.js';

const businessList = document.querySelector("#business-list");
const form = document.querySelector("#search-container");
const allBusinessRef = db.collection("businesses");

document.currentBsRef = currentBsRef;
document.cityFilteredRef = cityFilteredRef;

let currentBsRef = allBusinessRef;
let cityFilteredRef = allBusinessRef;

const inputsToToggle = [];
let showingAll = false;

firebase.auth().onAuthStateChanged(handleAuthAsync);

let showAllBtn = document.getElementById('showAllBtn').firstElementChild;
showAllBtn.addEventListener('click', changeFilter);
configInputs();

async function handleAuthAsync(user) {
    let city;
    if (user) {
        // user is signed in, get location to filter the list with
        let ref = db.collection('users').doc(user.uid);
        let snap = await ref.get();
        let dbUser = snap.data();
        city = dbUser.location;
    } else {
        // user not signed in, try to get city from localStorage
        city = localStorage.getItem("user-location");
    }

    addFilterToRef(city);
    // this function threw a lot of errors, needed so at least the page can load
    await tryToAsync(loadBusinessesAsync);
    // hide loader, show page
    document.hideLoader();
}

function changeFilter(event) {
    toggleShowAll();
    tryToAsync(loadBusinessesAsync);
}

function addFilterToRef(city) {
    if (city && city !== "") {
        city = city.toLowerCase();
        currentBsRef = currentBsRef.where("city", "==", city);
        cityFilteredRef = currentBsRef;
    } else {
        toggleShowAll();
    }
}

//create and render business list
function renderBusiness(doc) {
    let li = document.createElement("li");
    let name = document.createElement("span");
    let phone = document.createElement("span");
    let address = document.createElement("span");
    let city = document.createElement("span");
    let province = document.createElement("span");
    let a = document.createElement("a");


    li.setAttribute("data-id", doc.id);
    name.textContent = doc.data().name;
    phone.textContent = doc.data().phone;
    address.textContent = doc.data().address;
    city.textContent = doc.data().city;
    province.textContent = doc.data().province;
    a.href = "#";
    a.textContent = "Details";


    li.appendChild(name);
    li.appendChild(phone);
    li.appendChild(address);
    li.appendChild(city);
    li.appendChild(province);
    li.appendChild(a);

    businessList.appendChild(li);

    // upon anchor tag click, sets the correct id to local storage.
    a.addEventListener("click", (e) => {
        e.preventDefault();
        let docId = e.target.parentElement.getAttribute("data-id");
        localStorage.setItem("docId", docId);
        redirect();
    })

    // redirects to details.html page. 
    function redirect() {
        window.location.href = "./details.html";
    }
}

function configInputs() {
    let inputs = document.getElementsByTagName('input');

    for (let element of inputs) {
        inputsToToggle.push(element);
    }
}

function setInputsAccess(turnOn) {
    const speed = "fast";
    let $spinner = $(document.getElementById('pageSpinner'));

    // fade in-out spinner
    !turnOn ? $spinner.fadeIn(speed) : $spinner.fadeOut(speed);

    // disabling-enabling inputs
    inputsToToggle.forEach(elem => $(elem).disabled = turnOn === false);

    // fade in-out the businesses list
    let $list = $(document.getElementById('business-list'));
    !turnOn ? $list.fadeOut(speed) : $list.fadeIn(speed);
}

function toggleShowAll() {
    showingAll = !showingAll;
    showAllBtn.innerHTML = showingAll ? "In City" : "Show all";
    resetCollRef();
}

// Search button functionality
form.addEventListener("submit", (e) => {
    e.preventDefault();
    tryToAsync(loadBusinessesAsync);
})

function resetCollRef() {
    currentBsRef = showingAll ? allBusinessRef : cityFilteredRef;
    return currentBsRef;
}

// Get businesses
async function loadBusinessesAsync() {
    // disable inputs, show spinner
    setInputsAccess(false);

    //clear list
    $(businessList).empty();

    // set filter to the db ref
    addFilter();

    // get the snapshot
    let snap = await currentBsRef.get();
    // process data
    snap.docs.forEach(doc => renderBusiness(doc));

    // enable inputs, hide spinner
    setInputsAccess(true);
}

function addFilter() {
    const input = form.searchBar.value.toLowerCase();
    if (input !== "") {
        let ref = resetCollRef();
        currentBsRef = ref.where("category", "==", input);
    } else {
        resetCollRef();
    }
}