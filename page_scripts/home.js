import {
    db
} from './firebase_api_littleguys.js';
import {
    tryToAsync
} from '../core/utils.js';

const businessList = document.querySelector("#business-list");
const form = document.querySelector("#search-container");
const allBusinessRef = db.collection("businesses");
let currentBsRef = allBusinessRef;
let cityFilteredRef = allBusinessRef;
let showingAll = false;
const inputsToToggle = [];
document.currentBsRef = currentBsRef;
document.cityFilteredRef = cityFilteredRef;

let showAllBtn = document.getElementById('showAllBtn').firstElementChild;
showAllBtn.addEventListener('click', () => {
    toggleShowAll();
    tryToAsync(loadBusinessesAsync);
});

configInputs();

firebase.auth().onAuthStateChanged(handleAuthAsync);

async function handleAuthAsync(user) {
    let city;
    if (user) {
        let ref = db.collection('users').doc(user.uid);
        let snap = await ref.get();
        let dbUser = snap.data();
        city = dbUser.location;
    } else {
        city = localStorage.getItem("user-location");
    }

    setCollRefFilter(city);
    await tryToAsync(loadBusinessesAsync);
    document.hideLoader();
}

function setCollRefFilter(city) {
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

    for (const element of inputs) {
        inputsToToggle.push(element);
    }
}

function setFormSubmitionAccess(turnOn) {
    let $spinner = $(document.getElementById('pageSpinner'));
    turnOn ? $spinner.fadeOut("fast") : $spinner.fadeIn("fast");
    inputsToToggle.forEach(elem => {
        $(elem).disabled = turnOn === false;
    });

    let $list = $(document.getElementById('business-list'));
    !turnOn ? $list.fadeOut("fast") : $list.fadeIn("fast");
}

function toggleShowAll() {
    showingAll = !showingAll;
    showAllBtn.innerHTML = showingAll ? "In City" : "Show all";
    resetCollectionRef();
}

// Search button functionality
form.addEventListener("submit", (e) => {
    e.preventDefault();
    tryToAsync(loadBusinessesAsync);
})


function resetCollectionRef() {
    currentBsRef = showingAll ? allBusinessRef : cityFilteredRef;
    return currentBsRef;
}

// Get businesses
async function loadBusinessesAsync() {
    setFormSubmitionAccess(false);
    $(businessList).empty();
    addFilter();
    let snap = await currentBsRef.get();
    snap.docs.forEach(doc => {
        renderBusiness(doc);
    });
    setFormSubmitionAccess(true);
}

function addFilter() {
    const input = form.searchBar.value.toLowerCase();
    if (input !== "") {
        let ref = resetCollectionRef();
        currentBsRef = ref.where("category", "==", input);
    } else {
        resetCollectionRef();
    }
}