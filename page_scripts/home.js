import { db } from './firebase_api_littleguys.js';

const businessList = document.querySelector("#business-list");
const form = document.querySelector("#search-container");

let input = "pears";

//create and render business list
function renderBusiness(doc){
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
    a.addEventListener("click", (e) =>{
        let docId = e.target.parentElement.getAttribute("data-id");
        localStorage.setItem("docId", docId);  
        console.log(docId);
        redirect();      
    })

    // redirects to details.html page. 
    function redirect(){
        window.location.href = "./details.html";
    }
}

// Search button functionality
form.addEventListener("submit", (e) =>{
    e.preventDefault();
    input = form.searchBar.value;
    orderList(input);
})

// Resets list items, displays only specified items.
function orderList(orderBy){
    $("#business-list").empty();
    db.collection("businesses").where("category", "==", orderBy).get().then((snapshot) =>{
        snapshot.docs.forEach(doc => {
            renderBusiness(doc);
        })
    })
}

// Display all businesses
db.collection("businesses").get().then((snapshot) =>{
    snapshot.docs.forEach(doc => {
        renderBusiness(doc);
    })
})