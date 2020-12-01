import {
    db
} from './firebase_api_littleguys.js';

var docId = localStorage.getItem("docId");
console.log(docId);



retrieveDetail();

async function retrieveDetail() {
    let ref = db.collection("businesses").doc(docId);
    let snap = await ref.get();

    renderDetails(snap.data());

}

function renderDetails(business){

    let li = document.createElement("li");
    let name = document.createElement("span");
    let city = document.createElement("span");
    let province = document.createElement("span");
    let address = document.createElement("span");
    let phone = document.createElement("span");
    let description = document.createElement("span");
    let addTitle = document.createElement("span");
    let a = document.createElement("a");

    name.textContent = business.name;
    city.textContent = business.city;
    province.textContent = business.province;
    address.textContent = business.address;
    phone.textContent = business.phone;
    description.textContent = business.description;
    addTitle.textContent = "Address";
    a.textContent = "Directions";
    a.href = business.maps;
    a.target = "_blank";
    a.id = "direct";

    li.appendChild(name);
    li.appendChild(phone);
    li.appendChild(description);
    li.appendChild(addTitle);
    li.appendChild(address);
    li.appendChild(city);
    li.appendChild(province);
    li.appendChild(a);

    businessDetails.appendChild(li);
}

