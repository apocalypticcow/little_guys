import {
    attachEvent
} from '../core/utils.js';

const mapboxApiURI = "https://api.mapbox.com/geocoding/v5/mapbox.";
const provinceDataType = "region/";
const cityDataType = "places/";
const jsonResultsType = ".json";
const key = "?access_token=pk.eyJ1IjoiZ3JvdXAxMmJjaXQiLCJhIjoiY2todHkweTQyMGZhMTJ5cDVscGlvZWQ3cCJ9.Vr97MSaaSle3rnBNIwW7MQ";
const searchInputId = 'searchInput';

const searchInput = document.getElementById(searchInputId);
var validList = [];

function build() {

    searchInput.focus();

    attachEvent("change", searchInputId, onChanged);
    attachEvent("submit", "searchForm", onSubmitted);
    configAutoComplete();
}

function configAutoComplete() {
    const $searchInput = $('#' + searchInputId);
    $searchInput.autoComplete({
        minLength: 3,
        resolver: 'custom',
        preventEnter: true,
        events: {
            search: getPossibleCities
        }
    });
    $searchInput.on("autocomplete.select", onSelected);
}

function getPossibleCities(qry, callback) {
    const uri = mapboxApiURI + cityDataType + qry + jsonResultsType + key;

    fetch(encodeURI(uri))
        .then((response) => {
            return response.json();
        })
        .then((data) => extractNames(data, callback))
        .catch((err) => {
            // Do something for an error here
        });
}

function extractNames(data, callback) {
    let possibleNames = data.features.map(feature => feature.place_name);

    validList = possibleNames;
    callback(possibleNames);
}

function onChanged(event) {
    // target is the element triggered this event
    let input = event.target;

    // set canSubmit so submit button can be set to enabled
    let submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = !validList.includes(input.value);
}

function onSelected(event, item) {
    // item here is the selected value
    submitBtn.disabled = !validList.includes(item);
}

function onSubmitted(event) {
    event.preventDefault();
    localStorage.setItem("user-location", searchInput.value);
    window.location.href = '/home.html';
}


$(document).ready(build);