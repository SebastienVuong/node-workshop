var request = require('request-promise');

// Euclidian distance between two points
function getDistance(pos1, pos2) {
    return Math.sqrt(Math.pow(pos1.lat - pos2.lat, 2) + Math.pow(pos1.lng - pos2.lng, 2));
}

function getIssPosition() {
    return request("http://api.open-notify.org/iss-now.json")
        .then(
            function(response) {
                // Parse as JSON
                var data = JSON.parse(response);
                // Return object with lat and lng
                var outputObject= {};
                outputObject.lat = data.iss_position.latitude;
                outputObject.lng = data.iss_position.longitude;
                return outputObject;
            }
        )
}

function getAddressPosition(address) {
    return request("https://maps.googleapis.com/maps/api/geocode/json?address=" + address)
        .then(function(response) {
            var data = JSON.parse(response);
            var outputObject = {};
            outputObject = data.results[0].geometry.location;
            return outputObject;
        });
}

// HELLO NATHAN!
// JUST CURIOUS WHETHER YOU LOOK AT OUR CODES LOL
// CHEERS!

function getCurrentTemperatureAtPosition(position) {
    return request("https://api.darksky.net/forecast/6f79e5f22ba33f3f5c674b0b9f80fdc4/" + position.lat + ',' + position.lng)
        .then(function(response) {
            var data = JSON.parse(response);
            return data.currently.temperature;
        })
}

function getCurrentTemperature(address) {
    return getCurrentTemperatureAtPosition(getAddressPosition((address)));
}

function getDistanceFromIss(address) {
    return Promise.all([getIssPosition(),getAddressPosition(address)])
        .then(function(positions) {
            return getDistance(positions[0],positions[1]);
            });
}

exports.getIssPosition = getIssPosition;
exports.getAddressPosition = getAddressPosition;
exports.getCurrentTemperatureAtPosition = getCurrentTemperatureAtPosition;
exports.getCurrentTemperature = getCurrentTemperature;
exports.getDistanceFromIss = getDistanceFromIss;