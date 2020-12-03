import {
    getElemById,
    attachEvent
} from '../core/utils.js';

const mapboxApiURI = "https://api.mapbox.com/geocoding/v5/mapbox.";
const cityDataType = "places/";
const jsonResultsType = ".json";
const typeOfResults = "?types=place&"
const key = "&access_token=pk.eyJ1IjoiZ3JvdXAxMmJjaXQiLCJhIjoiY2todHkweTQyMGZhMTJ5cDVscGlvZWQ3cCJ9.Vr97MSaaSle3rnBNIwW7MQ";

const searchInputId = "searchInput";
const searchInput = getElemById(searchInputId);
let validList = [];
let locationValid = false;
let onChangedCallBack = function () {};

function getInputId() {
    return searchInputId;
}

function configAutoComplete(onChangedCallBack) {
    onChangedCallBack = onChangedCallBack;

    const $searchInput = $(searchInput);
    $searchInput.autoComplete({
        minLength: 3,
        resolver: 'custom',
        events: {
            search: getPossibleCities
        }
    });

    attachEvent("change", searchInputId, onChanged);
    $searchInput.on("autocomplete.select", onSelected);
}

function getSelected() {
    return searchInput.value;
}

function setValidity(location) {
    let errorMsg = location === "" ? "Location must be provided!" : "Location is Invalid!";
    getElemById('loc-feedback').innerText = errorMsg;
    locationValid = validList.includes(location) && location !== "";
}

function onSelected(event, item) {
    // item here is the selected value
    setValidity(item);
}

function onChanged(event) {
    // target is the element triggered this event
    let input = event.target;

    // set canSubmit so submit button can be set to enabled
    setValidity(input.value);
    onChangedCallBack();
}

function getPossibleCities(qry, callback) {
    const uri = mapboxApiURI + cityDataType + qry + jsonResultsType + typeOfResults + key;

    fetch(encodeURI(uri))
        .then((response) => {
            return response.json();
        })
        .then((data) => extractNames(data, callback))
        .catch((err) => {
            console.log(err);
        });
}

function extractNames(data, callback) {

    // filter to only cities in Canada
    let placesInCa = data.features
        .filter(feature => {
            let country = feature.context.find(ctx => ctx.id.startsWith("country"));
            return country.text == "Canada" && feature.place_type.includes("place");
        });

    // Selecting only the text value of the results (cities in this context)
    let possiblePlaces = placesInCa.map(feature => feature.text);

    validList = possiblePlaces;

    // this processes to show for the autocomplete input element
    callback(possiblePlaces);
}

function updateInputVal(location) {
    // the autocomplete state programatic update
    searchInput.value = location;
    validList.push(location);

    // programaticly trigger the event since assigning above won't trigger it
    searchInput.dispatchEvent(new Event("change"));
}

export {
    configAutoComplete,
    locationValid,
    updateInputVal,
    getInputId,
    getSelected,
}