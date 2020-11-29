const mapboxApiURI = "https://api.mapbox.com/geocoding/v5/mapbox.";
const provinceDataType = "region/";
const cityDataType = "places/";
const jsonResultsType = ".json";
const key = "?access_token=pk.eyJ1IjoiZ3JvdXAxMmJjaXQiLCJhIjoiY2todHkweTQyMGZhMTJ5cDVscGlvZWQ3cCJ9.Vr97MSaaSle3rnBNIwW7MQ";
let validList = [];
const searchInputId = "searchInput";

function configAutoComplete(onSelected) {
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


export {
    validList,
    configAutoComplete,
    searchInputId
}