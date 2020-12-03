import {
    db
} from './firebase_api_littleguys.js';

const form = document.querySelector("#busForm");

// Saving data
form.addEventListener("submit", (e) => {
    e.preventDefault();
    db.collection("businesses").add({
        name: form.shopName.value,
        city: form.shopCity.value,
        province: form.shopProvince.value,
        address: form.shopAddress.value,
        phone: form.shopPhone.value,
        address2: form.shopAddress2.value,
        description: form.description.value,
        category: form.shopCategory.value
    });
    form.shopName.value = "";
    form.shopCity.value = "";
    form.shopProvince.value = "";
    form.shopAddress.value = "";
    form.shopPhone.value = "";
    form.shopAddress2.value = "";
    form.description.value = "";
    form.shopCategory.value = "";
})