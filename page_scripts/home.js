import {
    db
} from './firebase_api_littleguys.js';
import {
    tryTo
} from '../core/utils.js';

const businessList = document.querySelector("#business-list");
const form = document.querySelector("#search-container");
const allBusinessRef = db.collection("businesses");
let currentBsRef = allBusinessRef;
let cityFilteredRef = allBusinessRef;
let showingAll = false;

document.currentBsRef = currentBsRef;
document.cityFilteredRef = cityFilteredRef;

firebase.auth().onAuthStateChanged(async function (user) {
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
    tryTo(loadBusinesses);
});

function setCollRefFilter(city) {
    if (city && city !== "") {
        city = city.toLowerCase();
        currentBsRef = currentBsRef.where("city", "==", city);
        cityFilteredRef = currentBsRef;
    } else {
        toggleShowAll();
    }
}

let showAllBtn = document.getElementById('showAllBtn').firstElementChild;
showAllBtn.addEventListener('click', () => {
    toggleShowAll();
    tryTo(loadBusinesses);
});

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

function toggleShowAll() {
    showingAll = !showingAll;
    setCollectionRef();
}

// Search button functionality
form.addEventListener("submit", (e) => {
    e.preventDefault();
    tryTo(loadBusinesses);
})


function setCollectionRef() {
    if (showingAll) {
        showAllBtn.innerHTML = "In City";
        currentBsRef = allBusinessRef;
    } else {
        showAllBtn.innerHTML = "Show all";
        currentBsRef = cityFilteredRef;
    }
    return currentBsRef;
}

// Get businesses
async function loadBusinesses() {
    $(businessList).empty();

    addFilter();
    let collection = [];
    let snap = await currentBsRef.get();
    snap.docs.forEach(doc => {
        collection.push(doc.data());
        renderBusiness(doc);
    });

    document.hideLoader();
}

function addFilter() {
    const input = form.searchBar.value.toLowerCase();
    if (input !== "") {
        let ref = setCollectionRef();
        currentBsRef = ref.where("category", "==", input);
    }
}