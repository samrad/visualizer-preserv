;
(function (comsys, $, undefined) {

    // Public property to hold markers
    comsys.markers = [];

    // Toggle the update repetition
    comsys.enableUpdate = false;

    comsys.init = function () {

        // Load map and render polys afterward
        comsys.loadMap();

        // Click handler for timer
        $("#update").click(function () {

            comsys.enableUpdate = !comsys.enableUpdate;
            console.log("update is " + comsys.enableUpdate)

            // Counter
            var myCounter = new Countdown({
                seconds: 15,
                onUpdateStatus: function(sec){
                    console.log(sec);
                    $("#timer").html(sec);
                },
                onCounterEnd: function(){
                    console.log('counter ended & update fired');
                    comsys.update();
                }
            });

            // If update is true
            if (comsys.enableUpdate) {
                console.log("next update in ? sec");
                $("#update").closest("li").addClass("active");
                myCounter.start();
            } else {
                console.log("update stopped");
                $("#update").closest("li").removeClass("active");
                $("#timer").html("Stopped");
                myCounter.stop();
            }

        });

        // Click handler for dummy
        $("#dummy").click(function () {
            console.log("dummy clicked");

            // Clear the map to avoid overlaying markers
            comsys.markers.forEach(function clear(entry) {
                entry.setMap(null);
            })

            var dummy = [
                new google.maps.LatLng(50.776204378856654, 6.07514139264822),
                new google.maps.LatLng(50.778063265101366, 6.078681908547878),
                new google.maps.LatLng(50.78012410861307, 6.076223831623793),
                new google.maps.LatLng(50.77981883560066, 6.075816135853529),
                new google.maps.LatLng(50.77993416119513, 6.076170187443495),
                new google.maps.LatLng(50.78114845460269, 6.074668150395155),
                new google.maps.LatLng(50.77814038141936, 6.060529346577823),
                new google.maps.LatLng(50.778194654270685, 6.060228939168155),
                new google.maps.LatLng(50.77828963160895, 6.060454244725406),
                new google.maps.LatLng(50.778836648561914, 6.072716675698757),
                new google.maps.LatLng(50.77611469759955, 6.079978924244642),
                new google.maps.LatLng(50.77580261396482, 6.078058462589979),
                new google.maps.LatLng(50.77619611037916, 6.077082138508558),
                new google.maps.LatLng(50.780790402439926, 6.077437363564968),
                new google.maps.LatLng(50.78195718874058, 6.073167286813259),
                new google.maps.LatLng(50.77844317436444, 6.070957146584988),
                new google.maps.LatLng(50.77798185557204, 6.0666656121611595),
                new google.maps.LatLng(50.77835349740038, 6.060044746845961),
                new google.maps.LatLng(50.776969524717245, 6.064411383122206),
                new google.maps.LatLng(50.78002913500056, 6.064647417515516),
                new google.maps.LatLng(50.77709842586344, 6.076706629246473),
                new google.maps.LatLng(50.777871825279874, 6.079603414982557),
                new google.maps.LatLng(50.77688811328396, 6.079442482441664),
                new google.maps.LatLng(50.77862485979052, 6.077918987721205),
                new google.maps.LatLng(50.77629713411306, 6.0800480749458075),
                new google.maps.LatLng(50.77609021013419, 6.077210297808051)
            ];

            dummy.forEach(function target(coord) {

                var color = "red";
                comsys.polys.forEach(function area(poi) {
                    if (google.maps.geometry.poly.containsLocation(coord, poi.poly)) {
                        color = "green";
                        return;
                    }
                    ;
                });

                var circle = {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: color,
                    fillOpacity: 1.0,
                    strokeColor: 'white',
                    strokeWeight: 1.0,
                    scale: 5
                };

                var tmp = new google.maps.Marker({
                    position: coord,
                    // map: comsys.map,
                    icon: circle
                });

                comsys.markers.push(tmp);
            });

            // Animated
            var c = 0;
            var timer = setInterval(function () {
                comsys.markers[c].setMap(comsys.map);
                c++;
                if (c === comsys.markers.length) {
                    clearInterval(timer);
                }
                ;
            }, 100);


            // Return false to avoid href effect on anchor
            return false;
        });
    };

}(window.comsys = window.comsys || {}, jQuery));


// [comsys.readJSON] Retrieve JSON and render polygons
;
(function (comsys, $, undefined) {

    // Private fields for Polys' style
    var strkColor = '#27BAFF';
    var strkOpacity = 0.9;
    var strkWeight = 2;
    var fColor = '#27BAFF';
    var fOpacity = 0.5;

    // Array of polys
    comsys.polys = [];

    // Render ploys on map (private)
    function drawPolys() {
        comsys.polys.forEach(function (entry) {
            console.log(entry.poly);
            entry.poly.setMap(comsys.map);
        });
    };

    // Ajax call to get the JSON and parse it
    // to Polys
    comsys.readJSON = function () {

        var request = $.ajax({
            url: "/monkey",
            type: "GET",
            dataType: "json"
        });

        request.done(function (data) {
            jsonToPoly(data);
            drawPolys();
        });

        request.error(function (data) {
            console.log("Reading JSON was failed");
        });
    };

    // Convert the JSON to POI objects
    // and store them in comsys.polys[]
    function jsonToPoly(json) {
        json.polys.forEach(function (p) {
            var name = p.name;
            var path = [];
            p.vtx.forEach(function (v) {
                path.push(new google.maps.LatLng(v.lat, v.lng));
            });

            // Construction of Google Map's polys
            var tmp = new google.maps.Polygon({
                paths: path,
                strokeColor: strkColor,
                strokeOpacity: strkOpacity,
                strokeWeight: strkWeight,
                fillColor: fColor,
                fillOpacity: fOpacity
            });

            comsys.polys.push(new poi(name, tmp));
        });
    };

    // Class for POIs (private)
    function poi(n, p) {
        this.name = n;
        this.poly = p;
    };

}(window.comsys = window.comsys || {}, jQuery));


// [comsys.loadMap] Initialization of the Google Map
;
(function (comsys, $, undefined) {

    // Reference to the Map element
    comsys.map = {};

    // Google Map style (private)
    var styles = [
        {
            "stylers": [
                {
                    "hue": "#ff1a00"
                },
                {
                    "invert_lightness": true
                },
                {
                    "saturation": -100
                },
                {
                    "lightness": 33
                },
                {
                    "gamma": 0.5
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#2D333C"
                }
            ]
        }
    ];

    // Load Google Map (public)
    comsys.loadMap = function () {

        // Create a new StyledMapType object, passing it the array of styles,
        // as well as the name to be displayed on the map type control.
        var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});

        var aachen = new google.maps.LatLng(50.780912509314476, 6.0665154084563255);
        var mapOptions = {
            zoom: 15,
            center: aachen,
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
            }
        };

        // Getting the 'map' element
        comsys.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        //Associate the styled map with the MapTypeId and set it to display.
        comsys.map.mapTypes.set('map_style', styledMap);
        comsys.map.setMapTypeId('map_style');

        // Ajax request to read the JSON
        comsys.readJSON();

    };

}(window.comsys = window.comsys || {}, jQuery));


;
(function (comsys, $, undefined) {

    // Ajax call to update the data. It calls itself
    // if the comsys.enableUpdate is set to true.
    comsys.update = function () {

        if (comsys.enableUpdate === false) {
            clearInterval(comsys.updateTimer);
        };

        var request = $.ajax({
            url: "/rhino",
            type: "GET",
            dataType: "json"
        });

        request.done(function (data) {
            updatePoly(shuffle(data));
        });

        request.error(function (data) {
            console.log("Reading JSON was failed");
        });

        request.always(function () {

//            var myCounter = new Countdown({
//                seconds: 15,
//                onUpdateStatus: function(sec){
//                    console.log(sec);
//                    $("#timer").html(sec);
//                },
//                onCounterEnd: function(){
//                    console.log('counter ended & update fired');
//                    comsys.update();
//                }
//            });
//
//            if (comsys.enableUpdate) {
//                console.log("next update in ? sec");
//                myCounter.start();
//            } else {
//                console.log("update stopped");
//                $("#timer").html("Stopped");
//                myCounter.stop();
//            }
        });
    };

    // Shuffle the array (private)
    function shuffle(array) {
        var m = array.length, t, i;

        // While there remain elements to shuffle…
        while (m) {

            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);

            // And swap it with the current element.
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }

        return array;
    };

    function updatePoly(array) {

        comsys.polys.forEach(function (entry, idx) {
            switch (true) {
                case (array[idx] <= 50) :
                    entry.poly.setOptions({strokeColor: "#047331", fillColor: "#047331"});
                    break;
                case (array[idx] > 50 && array[idx] <= 100):
                    entry.poly.setOptions({strokeColor: "#388C04", fillColor: "#388C04"});
                    break;
                case (array[idx] > 100 && array[idx] <= 150):
                    entry.poly.setOptions({strokeColor: "#CACE17", fillColor: "#CACE17"});
                    break;
                case (array[idx] > 150 && array[idx] <= 600):
                    entry.poly.setOptions({strokeColor: "#E16519", fillColor: "#E16519"});
                    break;
                case (array[idx] > 600):
                    entry.poly.setOptions({strokeColor: "#CA0300", fillColor: "#CA0300"});
                    break;
                default:
                    console.log("No color code");
            }

        });
    };

    function Countdown(options) {
        var timer,
            instance = this,
            seconds = options.seconds || 10,
            updateStatus = options.onUpdateStatus || function () {},
            counterEnd = options.onCounterEnd || function () {};

        function decrementCounter() {
            updateStatus(seconds);
            if (seconds === 0) {
                counterEnd();
                instance.stop();
            }
            seconds--;
        }

        this.start = function () {
            clearInterval(timer);
            timer = 0;
            seconds = options.seconds;
            timer = setInterval(decrementCounter, 1000);
        };

        this.stop = function () {
            clearInterval(timer);
        };
    }

}(window.comsys = window.comsys || {}, jQuery));


// function initialize() {

//               // Create an array of styles.
//               var styles = [
//               {
//                 "stylers": [
//                 {
//                   "hue": "#ff1a00"
//                 },
//                 {
//                   "invert_lightness": true
//                 },
//                 {
//                   "saturation": -100
//                 },
//                 {
//                   "lightness": 33
//                 },
//                 {
//                   "gamma": 0.5
//                 }
//                 ]
//               },
//               {
//                 "featureType": "water",
//                 "elementType": "geometry",
//                 "stylers": [
//                 {
//                   "color": "#2D333C"
//                 }
//                 ]
//               }
//               ];

//               // Grayscale
//               // var styles = [
//               // {
//               //   "featureType": "all",
//               //   "stylers": [
//               //   {
//               //     "saturation": -100
//               //   },
//               //   {
//               //     "gamma": 0.5
//               //   }
//               //   ]
//               // }
//               // ];

//               // Create a new StyledMapType object, passing it the array of styles,
//               // as well as the name to be displayed on the map type control.
//               var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});

//               var aachen = new google.maps.LatLng(50.77470542840657, 6.083869636058807);
//               var mapOptions = {
//                 zoom: 15,
//                 center: aachen,
//                 mapTypeControlOptions: {
//                   mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
//                 }
//               };

//               var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

//               //Associate the styled map with the MapTypeId and set it to display.
//               map.mapTypes.set('map_style', styledMap);
//               map.setMapTypeId('map_style');

//               var audimax = [
//               new google.maps.LatLng(50.77955484703642,6.07708394061774),
//               new google.maps.LatLng(50.77964473369342,6.0772207332775),
//               new google.maps.LatLng(50.77995509572798,6.07671111356467),
//               new google.maps.LatLng(50.77999240687212,6.076759393326938),
//               new google.maps.LatLng(50.7802773273548,6.076290006749332),
//               new google.maps.LatLng(50.78020100953859,6.07609688770026),
//               new google.maps.LatLng(50.78019592167975,6.075866217724979),
//               new google.maps.LatLng(50.77958367862447,6.075584585778415),
//               new google.maps.LatLng(50.7795616309411,6.075831349007785),
//               new google.maps.LatLng(50.77983298632081,6.075946683995426),
//               new google.maps.LatLng(50.779834682287,6.076271231286228),
//               new google.maps.LatLng(50.7799398320695,6.076517994515598),
//               new google.maps.LatLng(50.77978889117878,6.076780850999057),
//               new google.maps.LatLng(50.77976005971724,6.076740617863834),
//               new google.maps.LatLng(50.77955484703642,6.07708394061774)
//               ];

//               var informatik = [
//               new google.maps.LatLng(50.77795872061157,6.060513106640428),
//               new google.maps.LatLng(50.77800536152817,6.0606217361055315),
//               new google.maps.LatLng(50.77802147383401,6.060611007269472),
//               new google.maps.LatLng(50.77806811468802,6.060773280914873),
//               new google.maps.LatLng(50.778149524067175,6.0607209778390825),
//               new google.maps.LatLng(50.77820888498347,6.061005291994661),
//               new google.maps.LatLng(50.777983313100684,6.061128673609346),
//               new google.maps.LatLng(50.77803080200853,6.061368731316179),
//               new google.maps.LatLng(50.77835728694459,6.0611957288347185),
//               new google.maps.LatLng(50.7783369347035,6.061079052742571),
//               new google.maps.LatLng(50.7785251925956,6.060981152113527),
//               new google.maps.LatLng(50.7784777041898,6.060746458824724),
//               new google.maps.LatLng(50.778347958835205,6.060817537363619),
//               new google.maps.LatLng(50.77830895035755,6.0606338060460985),
//               new google.maps.LatLng(50.778392903345186,6.06059089070186),
//               new google.maps.LatLng(50.77833184664186,6.060299871023744),
//               new google.maps.LatLng(50.778520104554445,6.060197947081178),
//               new google.maps.LatLng(50.778537064689544,6.060289142187685),
//               new google.maps.LatLng(50.778841498068346,6.060117480810732),
//               new google.maps.LatLng(50.778796553989466,6.059904245194048),
//               new google.maps.LatLng(50.77862610529787,6.060004828032106),
//               new google.maps.LatLng(50.778595577108376,6.059894857462496),
//               new google.maps.LatLng(50.77854215272887,6.059923020657152),
//               new google.maps.LatLng(50.77854130472236,6.0596454120241106),
//               new google.maps.LatLng(50.778588793063584,6.059617248829454),
//               new google.maps.LatLng(50.77860320915762,6.0596722341142595),
//               new google.maps.LatLng(50.77870412169152,6.059619931038469),
//               new google.maps.LatLng(50.77869479365131,6.059579697903246),
//               new google.maps.LatLng(50.77925023280287,6.05928867822513),
//               new google.maps.LatLng(50.779379975654216,6.059876081999391),
//               new google.maps.LatLng(50.77954448568014,6.05977684026584),
//               new google.maps.LatLng(50.779559749467644,6.05984523659572),
//               new google.maps.LatLng(50.77956992532322,6.059838531073183),
//               new google.maps.LatLng(50.779594516965034,6.059936431702226),
//               new google.maps.LatLng(50.77961656463288,6.059925702866167),
//               new google.maps.LatLng(50.779594516965034,6.059826461132616),
//               new google.maps.LatLng(50.779758178251775,6.059727219399065),
//               new google.maps.LatLng(50.77970814714199,6.059500572737306),
//               new google.maps.LatLng(50.77958858105266,6.059564945753664),
//               new google.maps.LatLng(50.779554661539024,6.059354392345995),
//               new google.maps.LatLng(50.7796742277151,6.059342322405428),
//               new google.maps.LatLng(50.779602996838506,6.059043256100267),
//               new google.maps.LatLng(50.779504630211534,6.059163955505937),
//               new google.maps.LatLng(50.779428311134225,6.058754918631166),
//               new google.maps.LatLng(50.77949191037395,6.058717367704958),
//               new google.maps.LatLng(50.77943424706694,6.058447805698961),
//               new google.maps.LatLng(50.779158649396976,6.058596668299288),
//               new google.maps.LatLng(50.779161193382905,6.058646289166063),
//               new google.maps.LatLng(50.77910692165327,6.058678475674242),
//               new google.maps.LatLng(50.77916034538761,6.059032527264208),
//               new google.maps.LatLng(50.778653241449554,6.059322205837816),
//               new google.maps.LatLng(50.77864391339917,6.059285996016115),
//               new google.maps.LatLng(50.77835135087519,6.0592967248521745),
//               new google.maps.LatLng(50.778352198885166,6.059182730969042),
//               new google.maps.LatLng(50.778171572416326,6.059189436491579),
//               new google.maps.LatLng(50.778174116455936,6.059560922440141),
//               new google.maps.LatLng(50.778349654855226,6.059559581335634),
//               new google.maps.LatLng(50.778349654855226,6.059496549423784),
//               new google.maps.LatLng(50.778507384449085,6.059492526110262),
//               new google.maps.LatLng(50.77850568843476,6.0597473359666765),
//               new google.maps.LatLng(50.7782843580397,6.059869376476854),
//               new google.maps.LatLng(50.77827587792708,6.0598224378190935),
//               new google.maps.LatLng(50.77818598863898,6.059868035372347),
//               new google.maps.LatLng(50.77822330119465,6.060067859943956),
//               new google.maps.LatLng(50.77800112144676,6.060191241558641),
//               new google.maps.LatLng(50.77803589010292,6.060365585144609),
//               new google.maps.LatLng(50.77795956862867,6.060405818279833)
//               ];

//               var karman = [
//               new google.maps.LatLng(50.77621874268268,6.079691047780216),
//               new google.maps.LatLng(50.77602708329754,6.079924399964511),
//               new google.maps.LatLng(50.77613054554104,6.080130930058658),
//               new google.maps.LatLng(50.77618821292171,6.080061192624271),
//               new google.maps.LatLng(50.77638156773794,6.080447430722415),
//               new google.maps.LatLng(50.77650538224432,6.080278451554477),
//               new google.maps.LatLng(50.77640700910164,6.080063874833286),
//               new google.maps.LatLng(50.77647315658241,6.079986090771854),
//               new google.maps.LatLng(50.77644432307665,6.079932446591556),
//               new google.maps.LatLng(50.77665802981466,6.079680318944156),
//               new google.maps.LatLng(50.77670891222741,6.07972055207938),
//               new google.maps.LatLng(50.77670043182913,6.079760785214603),
//               new google.maps.LatLng(50.77675470635155,6.079865391366184),
//               new google.maps.LatLng(50.77688530416298,6.07983588706702),
//               new google.maps.LatLng(50.77694127454193,6.079766149632633),
//               new google.maps.LatLng(50.77693618632843,6.079677636735141),
//               new google.maps.LatLng(50.77695484310857,6.079648132435978),
//               new google.maps.LatLng(50.77693618632843,6.079605217091739),
//               new google.maps.LatLng(50.77695202074103,6.079574822215363),
//               new google.maps.LatLng(50.77697110153234,6.079619749216363),
//               new google.maps.LatLng(50.77698382205557,6.079620419768617),
//               new google.maps.LatLng(50.77700968710876,6.079586221603677),
//               new google.maps.LatLng(50.77698636615979,6.079539282945916),
//               new google.maps.LatLng(50.77699399847164,6.079527883557603),
//               new google.maps.LatLng(50.77701053514306,6.079528554109857),
//               new google.maps.LatLng(50.77709067431401,6.07943199458532),
//               new google.maps.LatLng(50.77701223121161,6.079265697626397),
//               new google.maps.LatLng(50.77699315043707,6.079288496403024),
//               new google.maps.LatLng(50.77697364563728,6.079276426462457),
//               new google.maps.LatLng(50.77695032467031,6.079307942418382),
//               new google.maps.LatLng(50.776913011099,6.079230828909203),
//               new google.maps.LatLng(50.77694396440458,6.07919059577398),
//               new google.maps.LatLng(50.77691513118907,6.07913829269819),
//               new google.maps.LatLng(50.77688375384611,6.07917249086313),
//               new google.maps.LatLng(50.77687781758966,6.079163773683831),
//               new google.maps.LatLng(50.77710551488615,6.078727244166657),
//               new google.maps.LatLng(50.77712289955039,6.078748701838777),
//               new google.maps.LatLng(50.77709279439604,6.078809051541612),
//               new google.maps.LatLng(50.77712247553426,6.078851296333596),
//               new google.maps.LatLng(50.7771826857854,6.078737302450463),
//               new google.maps.LatLng(50.77716487712765,6.078709809808061),
//               new google.maps.LatLng(50.77719116609623,6.078717185882852),
//               new google.maps.LatLng(50.77719879837466,6.078703774837777),
//               new google.maps.LatLng(50.77720770269793,6.078719197539613),
//               new google.maps.LatLng(50.77722551133937,6.078719197539613),
//               new google.maps.LatLng(50.77737985261449,6.078461705474183),
//               new google.maps.LatLng(50.77719116609623,6.078186108497903),
//               new google.maps.LatLng(50.77702155958743,6.078453658847138),
//               new google.maps.LatLng(50.77701943950216,6.078487186459824),
//               new google.maps.LatLng(50.77704021633352,6.078517361311242),
//               new google.maps.LatLng(50.77700417488553,6.078585087088868),
//               new google.maps.LatLng(50.77699145436783,6.078584416536614),
//               new google.maps.LatLng(50.7767722369028,6.078962608007714),
//               new google.maps.LatLng(50.77677435699926,6.078982054023072),
//               new google.maps.LatLng(50.77671143101502,6.079062373808483),
//               new google.maps.LatLng(50.77669336924627,6.07902496936731),
//               new google.maps.LatLng(50.77663146228289,6.079014240531251),
//               new google.maps.LatLng(50.77657803565959,6.079074590234086),
//               new google.maps.LatLng(50.77647499842802,6.079349516658112),
//               new google.maps.LatLng(50.77657718761745,6.079562752274796),
//               new google.maps.LatLng(50.77631217369802,6.079883276252076),
//               new google.maps.LatLng(50.77621874268268,6.079691047780216)
//               ];

//               // Construct the polygon.
//               var audimaxPoly = new google.maps.Polygon({
//                 paths: audimax,
//                 strokeColor: '#27BAFF',
//                 strokeOpacity: 0.9,
//                 strokeWeight: 2,
//                 fillColor: '#27BAFF',
//                 fillOpacity: 0.5
//               });

//              // Construct the polygon.
//              var informatikPoly = new google.maps.Polygon({
//                paths: informatik,
//                strokeColor: '#27BAFF',
//                strokeOpacity: 0.9,
//                strokeWeight: 2,
//                fillColor: '#27BAFF',
//                fillOpacity: 0.5
//              });

//              // Construct the polygon.
//              var karmanPoly = new google.maps.Polygon({
//                paths: karman,
//                strokeColor: '#27BAFF',
//                strokeOpacity: 0.9,
//                strokeWeight: 2,
//                fillColor: '#27BAFF',
//                fillOpacity: 0.5
//              });

//              audimaxPoly.setMap(map);
//              informatikPoly.setMap(map);
//              karmanPoly.setMap(map);

//   //      var ctaLayer = new google.maps.KmlLayer({
//   //        url: 'https://dl.dropboxusercontent.com/u/169649705/Henrik/rwth1.kml'
//   //      });
//   //      ctaLayer.setMap(map);
// }
