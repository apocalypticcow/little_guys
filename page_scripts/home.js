import {
    db
} from './firebase_api_littleguys.js';

const businessList = document.querySelector("#business-list");
const form = document.querySelector("#search-container");
let businessesRef = db.collection("businesses");

firebase.auth().onAuthStateChanged(async function (user) {

    if (user) {
        let ref = db.collection('users').doc(user.uid);
        let snap = await ref.get();
        let normalizedCity = snap.data().location.toLowerCase();
        businessesRef = businessesRef.where("city", "==", normalizedCity);
        loadBusinesses();
    }
});

let input = "pears";

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

// Search button functionality
form.addEventListener("submit", (e) => {
    e.preventDefault();
    input = form.searchBar.value;
    loadBusinesses(input);
})

// Get businesses
function loadBusinesses(filter) {
    $(businessList).empty();

    if (filter) {
        businessesRef = businessesRef.where("category", "==", filter);
    }

    businessesRef.get()
        .then((snapshot) => {
            snapshot.docs.forEach(doc => {
                renderBusiness(doc);
            })
        });
}