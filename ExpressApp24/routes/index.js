﻿'use strict';
var express = require('express');
var router = express.Router();
var request = require('request');
var fetch = require('node-fetch');
var parseString = require('xml2js').parseString;
var myResponse = null;

var airportEnum = {
    "ENO": "Enontekiön",
    "HEL": "Helsinki-Vantaan",
    "IVL": "Ivalon",
    "JOE": "Joensuun",
    "JYV": "Jyväskylän",
    "KAJ": "Kajaanin",
    "KEM": "Kemi-Tornion",
    "KUO": "Kuopion",
    "KTT": "Kittilän",
    "KOK": "Kokkolan",
    "KAO": "Kuusamon",
    "LAP": "Lappeenrannan",
    "MHQ": "Maarianhaminan",
    "OUL": "Oulun",
    "POR": "Porin",
    "ROV": "Rovaniemen",
    "SVL": "Savonlinnan",
    "TMP": "Tampere-Pirkkalan",
    "TKU": "Turun",
    "VAA": "Vaasan"
};

function getValue(key) {
    key = key.toUpperCase();
    return airportEnum[key];
}

var headers = {
    'Accept': 'text/plain',
    'app_id': '9b173c8e',
    'app_key': 'b7c773c97784e5d9732e3cd624a3aadd'
};

var options = {
    url: '',
    headers: headers
};

//Index

router.get('/', function (req, res) {
    if (Object.keys(req.query).length === 0)
        res.render('index', { title: "Express" });
    else
        res.render('index', { title: req.query.id });
});

//Arrivals

function arrival_callback(error, response, body) {

    console.log("error is " + error);

    if (!error && response.statusCode === 200) {

        var xml = body;

        if (xml.length === 153) {
            console.log("No flights in the next 30 hours");
            myResponse = "noflightsinnext30";
        } else {
            parseString(xml, function (err, result) {

                console.log(result.flights.arr[0].body[0].flight);
                myResponse = result.flights.arr[0].body[0].flight;

            });
        }
    }
}

router.get('/arrival', function (req, res) {

    if (Object.keys(req.query).length === 0)
        res.render('index', { apierror: "Invalid search" });
    else {

        try {
            options.url = 'https://api.finavia.fi/flights/public/v0/flights/arr/' + req.query.id;
            console.log(options.url);
            myResponse = null;
            request(options, arrival_callback);
            var addTime = 0;
            if (myResponse === null) {
                addTime = 1;
                request(options, arrival_callback);
            }

        } catch (error) {
            console.log(error);
        } finally {

            var d = new Date();
            var n = d.toUTCString();
            if (addTime === 1 && myResponse === null || myResponse === null) {
                request(options, arrival_callback);

                setTimeout(function () {
                    var a = new Date();
                    var b = a.toUTCString();
                    console.log("1st timeout " + b);
                    /*
                    if (addTime === 1) {
                        setTimeout(function () {
                            a = new Date();
                            b = a.toUTCString();
                            console.log("2nd timeout " + b);
                            if (myResponse === null) {
                                res.render('index', { title: "Express", apierror: "Api error " + n + " try again." });
                            } else {
                                console.log("Rendering 2nd timeout loop");
                                res.render('departure', { flightlist: myResponse, title: req.query.id });
                            }
                        }, 2000);
                    } else {*/
                    if (myResponse === 'noflightsinnext30') {
                        res.render('index', { title: "Express", apierror2: n + " Ei lentoja seuraavaan 30 tuntiin." });
                    } else if (myResponse === null) {
                        res.render('index', { title: "Express", apierror2: "Api error " + n + " try again." });
                    } else {
                        console.log("Rendering 1st timeout loop");
                        res.render('arrival', { arrivallist: myResponse, title: getValue(req.query.id) });
                    }
                    /*/*/
                }, 2000);
            } else if (myResponse === 'noflightsinnext30') {
                res.render('index', { title: "Express", apierro2r: n + " Ei lentoja seuraavaan 30 tuntiin." });
            } else {
                console.log("Rendering before loops");
                res.render('arrival', { arrivallist: myResponse, title: getValue(req.query.id) });
            }
        }

    }
});

//Departures

function departure_callback(error, response, body) {


    console.log("error is " + error);

    if (!error && response.statusCode === 200) {

        var xml = body;

        if (xml.length === 153) {
            console.log("No flights in the next 30 hours");
            myResponse = "noflightsinnext30";
        } else {
            parseString(xml, function (err, result) {

                console.log(result.flights.dep[0].body[0].flight);
                myResponse = result.flights.dep[0].body[0].flight;

            });
        }
    }
}

router.get('/departure', function (req, res) {

    if (Object.keys(req.query).length === 0)
        res.render('index', { apierror: "Invalid search" });
    else {


        try {
            options.url = 'https://api.finavia.fi/flights/public/v0/flights/dep/' + req.query.id;
            console.log(options.url);
            myResponse = null;
            request(options, departure_callback);
            var addTime = 0;
            if (myResponse === null) {
                addTime = 1;
                request(options, departure_callback);
            }

        } catch (error) {
            console.log(error);
        } finally {

            var d = new Date();
            var n = d.toUTCString();
            if (addTime === 1 && myResponse === null || myResponse === null) {
                request(options, departure_callback);

                setTimeout(function () {
                    var a = new Date();
                    var b = a.toUTCString();
                    console.log("1st timeout " + b);
                    /*
                    if (addTime === 1) {
                        setTimeout(function () {
                            a = new Date();
                            b = a.toUTCString();
                            console.log("2nd timeout " + b);
                            if (myResponse === null) {
                                res.render('index', { title: "Express", apierror: "Api error " + n + " try again." });
                            } else {
                                console.log("Rendering 2nd timeout loop");
                                res.render('departure', { flightlist: myResponse, title: req.query.id });
                            }
                        }, 2000);
                    } else {*/
                    if (myResponse === 'noflightsinnext30') {
                        res.render('index', { title: "Express", apierror: n + " Ei lentoja seuraavaan 30 tuntiin." });
                    } else if (myResponse === null) {
                        res.render('index', { title: "Express", apierror: "Api error " + n + " try again." });
                    } else {
                        console.log("Rendering 1st timeout loop");
                        res.render('departure', { flightlist: myResponse, title: getValue(req.query.id) });
                    }
                    /*/*/
                }, 2000);
            } else if (myResponse === 'noflightsinnext30') {
                res.render('index', { title: "Express", apierror: n + " Ei lentoja seuraavaan 30 tuntiin." });
            } else {
                console.log("Rendering before loops");
                res.render('departure', { flightlist: myResponse, title: getValue(req.query.id) });
            }
        }

    }
});
module.exports = router;


/*
async function departure_test(error, response, body) {
    try {
        console.log(error + " " + response.statusCode);
        if (!error && response.statusCode === 200) {
            return new Promise(
                (resolve, reject) => {
                    var xml = body;
                    parseString(xml, function (err, result) {
                        //console.log(body);
                        //console.log(JSON.stringify(result));
                        myResponse = result.flights.dep[0].body[0].flight;
                        //console.log(myResponse.h_apt[0])
                        //console.log(result.flights.dep[0].body[0].flight.h_apt[0]);
console.log(result.flights.dep[0].body[0].flight);
                    });
resolve(xml);
                }
            );
        }
    } catch (err) {
    console.log(err);
}
};



async function doRequest(vars) {
    return new Promise(function (resolve, reject) {
        request(vars, function (error, res, body) {
            if (!error && res.statusCode === 200) {
                
                var xml = body;
                parseString(xml, function (err, result) {

                    myResponse = result.flights.dep[0].body[0].flight;

                    console.log(result.flights.dep[0].body[0].flight);
                });
                console.log("done here");
                
                parseString(body, function (err, result) {

                    myResponse = result.flights.dep[0].body[0].flight;

                    console.log(myResponse);
                });
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
};
*/