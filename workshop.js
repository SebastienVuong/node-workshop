var request = require('request-promise'); // Imports request-promise module and allows us to use it

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
            })
                .catch(function(error){
                    console.log("Nuhhhh~", error);
                });
}

function getAddressPosition(address) {
    return request("https://maps.googleapis.com/maps/api/geocode/json?address=" + address)
        .then(function(response) {
            var data = JSON.parse(response);
            return data.results[0].geometry.location;
        })
            .catch(function(error){
                console.log("Nuhhhh~", error);
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
            .catch(function(error){
                console.log("Nuhhhh~", error);
            });
}

function getCurrentTemperature(address) {
    return getAddressPosition(address)
        .then(function(response) {
            return getCurrentTemperatureAtPosition(response)
        })
        /* OR .then(getCurrentTemperatureAtPosition);*/
            .catch(function(error){
                console.log("Nuhhhh~", error);
            });
} 

function getDistanceFromIss(address) {
    return Promise.all([getIssPosition(),getAddressPosition(address)])
        .then(function(positions) {
            return getDistance(positions[0],positions[1]);
        })
            .catch(function(error){
                console.log("Nuhhhh~", error);
            });
}

// Section below exports the functions so the test files can import them
exports.getIssPosition = getIssPosition;
exports.getAddressPosition = getAddressPosition;
exports.getCurrentTemperatureAtPosition = getCurrentTemperatureAtPosition;
exports.getCurrentTemperature = getCurrentTemperature;
exports.getDistanceFromIss = getDistanceFromIss;

// IMPORTING :
// var getIssPosition = require('./workshop.js')..getIssPosition; FOR FILES IN SAME FOLDER. 
// "./" necessary to specify it's a path, but to the current folder.
// ".getIssPosition" to call onto the function we want within the file because "require('./workshop.js)" returns an object with all the functions in it.
// 'require' exexutes the file so we only have the functions in the file usually.

// Usually, you'd import it this way : var functions = require('./workshop');
// and then, call functions.getIssPosition()
