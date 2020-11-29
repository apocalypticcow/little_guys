import {
    getElemById,
    attachEvent
} from '../core/utils.js';

const mapboxApiURI = "https://api.mapbox.com/geocoding/v5/mapbox.";
const cityDataType = "places/";
// const provinceDataType = "region/";
const jsonResultsType = ".json";
const key = "?access_token=pk.eyJ1IjoiZ3JvdXAxMmJjaXQiLCJhIjoiY2todHkweTQyMGZhMTJ5cDVscGlvZWQ3cCJ9.Vr97MSaaSle3rnBNIwW7MQ";

const searchInputId = "searchInput";
let validList = [];
let isSearchValid = false;
let onChangedCallBack = function () {};

function configAutoComplete(onChangedCallBack) {
    onChangedCallBack = onChangedCallBack;

    const $searchInput = $(getElemById(searchInputId));
    $searchInput.autoComplete({
        minLength: 3,
        resolver: 'custom',
        preventEnter: true,
        events: {
            search: getPossibleCities
        }
    });

    attachEvent("change", searchInputId, onChanged);
    $searchInput.on("autocomplete.select", onSelected);
}

function onSelected(event, item) {
    // item here is the selected value
    isSearchValid = validList.includes(item) && item !== "";
}

function onChanged(event) {
    // target is the element triggered this event
    let input = event.target;
    
    // set canSubmit so submit button can be set to enabled
    isSearchValid = validList.includes(input.value) && item !== "";
    
    onChangedCallBack()
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

export {
    isSearchValid,
    validList,
    configAutoComplete,
    searchInputId
}