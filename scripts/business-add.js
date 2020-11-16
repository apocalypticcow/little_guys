const form = document.querySelector("#busForm");

// Saving data
form.addEventListener("submit", (e) =>{
    e.preventDefault();
    db.collection("businesses").add({
        name: form.shopName.value,
        city: form.shopCity.value,
        province: form.shopProvince.value,
        address: form.shopAddress.value,
        phone: form.shopPhone.value
    });
    form.shopName.value = "";
    form.shopCity.value = "";
    form.shopProvince.value = "";
    form.shopAddress.value = "";
    form.shopPhone.value = "";
})

