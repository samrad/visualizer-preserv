;
(function (comsys, $, undefined) {

    // Public property to hold markers
    comsys.markers = [];

    // Flag to toggle the update
    comsys.enableUpdate = false;

    // Update ascii spinner
    var i = 0;
    function animateDot() {
        var spins = "◴◷◶◵";
        var label$ = $("#update-spinner");
        i = i == spins.length - 1 ? 0 : ++i;
        label$.text(spins[i]);
    }

    function startPeriodicSync() {
        stopPeriodicSync();
        comsys.spinIntId = setInterval(animateDot, 200);

        // This is the periodic update interval. Currently 10 seconds.
        comsys.intervalId = setInterval(comsys.update, 10000);
        console.log("Periodic update started");
    }

    function stopPeriodicSync() {
        clearInterval(comsys.spinIntId);
        clearInterval(comsys.intervalId);
        if (comsys.request && comsys.request.readystate != 4) {
            comsys.request.abort();
        }
        console.log("Periodic update stopped");
    }

    comsys.init = function () {

        // Load map and render polys afterward
        comsys.loadMap();

        // Click handler for update
        $("#update").click(function () {

            // Toggle the update status
            comsys.enableUpdate = !comsys.enableUpdate;
            console.log("update clicked: " + comsys.enableUpdate);

            if (comsys.enableUpdate) {
                $("#update").css("color", "#fb6a4a")
                $("#update-spinner").css("color", "#fb6a4a")
                startPeriodicSync();
            } else {
                $("#update").css("color", "")
                $("#update-spinner").css("color", "")
                stopPeriodicSync();
            }

            return false;

        });

        // Click handler for dummy
        $("#dummy").click(function () {
            console.log("dummy clicked");

            // Clear the map to avoid overlaying markers
            comsys.markers.forEach(function clear(entry) {
                entry.setMap(null);
            });

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

        var aachen = new google.maps.LatLng(50.778629, 6.066861);
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

    // Ajax call to update the data.
    comsys.update = function () {
        performRequest();
    }

    var performRequest = function () {
        comsys.request = $.ajax({
            url: "/dingo", // change to {url: "/rhino"} for using dummy coords
            type: "GET",
            dataType: "json"
        });

        comsys.request.done(function (data) {
            console.log("update success");
            updatePoly(shuffle(data));
        });

        comsys.request.error(function (data) {
            console.log("update failed");
        });
    }

//    };

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

        console.log(array);
        return array;
    };

    function updatePoly(array) {

        /*
         | Color code                     |
         |         | Old        | New     |
         |---------|------------|---------|
         | Cold    | #047331    | #fee5d9 |
         | Cool    | #388C04    | #fcae91 |
         | Warm    | #CACE17    | #fb6a4a |
         | Hot     | #E16519    | #de2d26 |
         | Red Hot | #CA0300    | #a50f15 |
        */

        comsys.polys.forEach(function (entry, idx) {
            switch (true) {
                // Cold
                case (array[idx] <= 50 && array[idx] > 0):
                    entry.poly.setOptions({strokeColor: "#fee5d9", fillColor: "#fee5d9"});
                    break;
                // Cool
                case (array[idx] > 50 && array[idx] <= 100):
                    entry.poly.setOptions({strokeColor: "#fcae91", fillColor: "#fcae91"});
                    break;
                // Warm
                case (array[idx] > 100 && array[idx] <= 150):
                    entry.poly.setOptions({strokeColor: "#fb6a4a", fillColor: "#fb6a4a"});
                    break;
                // Hot
                case (array[idx] > 150 && array[idx] <= 600):
                    entry.poly.setOptions({strokeColor: "#de2d26", fillColor: "#de2d26"});
                    break;
                // Red Hot
                case (array[idx] > 600):
                    entry.poly.setOptions({strokeColor: "#a50f15", fillColor: "#a50f15"});
                    break;
                default:
                    // Reset back to original color
                    entry.poly.setOptions({strokeColor: "#27BAFF", fillColor: "#27BAFF"});
            }

        });
    };

    comsys.counter = function(options) {
        var timer,
            instance = this,
            seconds = options.seconds || 10,
            updateStatus = options.onUpdateStatus || function () {},
            counterEnd = options.onCounterEnd || function () {};

        function decrementCounter() {
            updateStatus(seconds);
            if (seconds === 0) {
                counterEnd();
                seconds = options.seconds + 1 || 10;
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