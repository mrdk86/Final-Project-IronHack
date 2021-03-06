var geocoder;
var map;
var markers;
var p = true;

// initialise the google maps objects, and add listeners
function gmaps_init() {

    // center of the universe
    var latlng = new google.maps.LatLng(41.3979956, 2.1402184);
    var icons = 'assets/map-marker.png';

    var options = {
        zoom: 3,
        center: latlng,
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // create our map object
    map = new google.maps.Map(document.getElementById("gmaps-canvas"), options);

    // the geocoder object allows us to do latlng lookup based on address
    geocoder = new google.maps.Geocoder();

    var markersData = [{
            lat: 41.387274,
            lng: 2.143991,
            name: "Opinión usuario 1",
            address1: "Calle muntaner",
            comentarios: " Muy bien cominicado, poco ruido",
            seguridad: 20,
            tranquilidad: 30,
            ruido: 90,
            limpia: 50
        }, {
            lat: 41.391186,
            lng: 2.161039,
            name: "Opinión usuario 2",
            address1: "Calle calabria",
            seguridad: 60,
            comentarios: " Muy bien cominicado, poco ruido",
            tranquilidad: 100,
            ruido: 20,
            limpia: 50
        }, {
            lat: 41.400184,
            lng: 2.144377,
            name: "Opinión usuario 3",
            address1: "Calle Via Augusta",
            seguridad: 90,
            comentarios: "Bien comunicado, metro cerca",
            tranquilidad: 100,
            ruido: 20,
            limpia: 70
        }, {
            lat: 41.401769,
            lng: 2.170201,
            name: "Opinión usuario 4",
            address1: "Calle aragon",
            seguridad: 10,
            comentarios: " Muy bien cominicado, poco ruido",
            tranquilidad: 30,
            ruido: 40,
            limpia: 50
        } // don’t insert comma in last item
    ];


    var infoWindow = new google.maps.InfoWindow({
        //  content: content,
        //
        //  // Assign a maximum value for the width of the infowindow allows
        //  // greater control over the various content elements
        maxWidth: 350,
        maxHeight: 400
    });

    google.maps.event.addListener(map, 'click', function() {
        infoWindow.close();
    });
    displayMarkers();
    google.maps.event.addDomListener(window, 'load', gmaps_init);


    function displayMarkers() {

        // this variable sets the map bounds according to markers position
        var bounds = new google.maps.LatLngBounds();

        // for loop traverses markersData array calling createMarker function for each marker
        for (var i = 0; i < markersData.length; i++) {

            var latlng = new google.maps.LatLng(markersData[i].lat, markersData[i].lng);
            var name = markersData[i].name;
            var address1 = markersData[i].address1;
            var comentarios = markersData[i].comentarios;
            var seguridad = markersData[i].seguridad;
            var tranquilidad = markersData[i].tranquilidad;
            var limpia = markersData[i].limpia;
            var ruido = markersData[i].ruido;

            createMarker(latlng, name, address1, comentarios, seguridad, tranquilidad, limpia, ruido);

            // marker position is added to bounds variable
            bounds.extend(latlng);
        }

        // Finally the bounds variable is used to set the map bounds
        // with fitBounds() function
        map.fitBounds(bounds);
    }

    // This function creates each marker and it sets their Info Window content
    function createMarker(latlng, name, address1, comentarios, seguridad, tranquilidad, limpia, ruido) {
        var marker = new google.maps.Marker({
            map: map,
            position: latlng,
            icon: icons,
            title: name
        });

        // This event expects a click on a marker
        // When this event is fired the Info Window content is created
        // and the Info Window is opened.
        var list = google.maps.event.addListener(marker, 'click', function() {

            // Creating the content to be inserted in the infowindow
            var iwContent = '<div class="col-md-4"><div id="iw-container">' +
                '<div class="iw-title">' + name + '</div>' +
                '<div class="iw-content">' +
                '<div class="iw-subTitle">' + address1 + '</div>' +
                '<p>' + comentarios + '</p>' +
                '<div class="iw-subTitle">Peligrosidad de la zona:</div>' +
                '<div class="progress">' +
                '<div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style="width:' + seguridad + '%">' +
                '<span class="sr-only">80% Complete (danger)</span>' +
                '</div></div>' +
                '<div class="iw-subTitle">Es tranquila?</div>' +
                '<div class="progress">' +
                '<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: ' + tranquilidad + '%">' +
                '<span class="sr-only">60% Complete (warning)</span>' +
                '</div>' +
                '</div>' +
                '<div class="iw-subTitle">Es Ruidosa?</div>' +
                '<div class="progress">' +
                '<div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: ' + ruido + '%">' +
                '<span class="sr-only">20% Complete</span>' +
                '  </div></div>' +
                '<div class="iw-subTitle">Es Limpia?</div>' +
                '<div class="progress">' +
                '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: ' + limpia + '%">' +
                '<span class="sr-only">20% Complete</span>' +
                '  </div></div>' +
                '</div>' +
                '</div></div>';

            // including content to the Info Window.
            infoWindow.setContent(iwContent);
            // opening the Info Window in the current map and at the current marker location.
            $('.content-maps').append(iwContent);

            infoWindow.open(map, marker);
            list.remove();
        });


    }

    // event triggered when marker is dragged and dropped
    // google.maps.event.addListener(marker, 'click', function() {
    //    geocode_lookup( 'latLng', marker.getPosition() );
    //
    // });

    // event triggered when map is clicked
    google.maps.event.addListener(map, 'click', function(event) {
        marker.setPosition(event.latLng);
        geocode_lookup('latLng', event.latLng);
        infowindow.open(map, marker);
        $('.content-maps').append(contentString);
    });
    // google.maps.event.addListener(marker, 'click', (function(marker, i) {
    //     return function() {
    //       infowindow.setContent(locations[i][0]);
    //       infowindow.open(map, marker);
    //     }
    //   })(marker, i));

    $('#gmaps-error').hide();
}



// move the marker to a new position, and center the map on it
function update_map(geometry) {
    map.fitBounds(geometry.viewport);
    marker.setPosition(geometry.location);
}

// fill in the UI elements with new position data
function update_ui(address, latLng) {
    $('#gmaps-input-address').autocomplete("close");
    $('#gmaps-input-address').val(address);
    //$('#gmaps-output-latitude').html(latLng.lat());
    //$('#gmaps-output-longitude').html(latLng.lng());
}

// Query the Google geocode object
//
// type: 'address' for search by address
//       'latLng'  for search by latLng (reverse lookup)
//
// value: search query
//
// update: should we update the map (center map and position marker)?
function geocode_lookup(type, value, update) {
    // default value: update = false
    update = typeof update !== 'undefined' ? update : false;

    request = {};
    request[type] = value;

    geocoder.geocode(request, function(results, status) {
        $('#gmaps-error').html('');
        $('#gmaps-error').hide();
        if (status == google.maps.GeocoderStatus.OK) {
            // Google geocoding has succeeded!
            if (results[0]) {
                // Always update the UI elements with new location data
                update_ui(results[0].formatted_address,
                    results[0].geometry.location);

                // Only update the map (position marker and center map) if requested
                if (update) {
                    update_map(results[0].geometry)
                }
            } else {
                // Geocoder status ok but no results!?
                $('#gmaps-error').html("Sorry, something went wrong. Try again!");
                $('#gmaps-error').show();
            }
        } else {
            // Google Geocoding has failed. Two common reasons:
            //   * Address not recognised (e.g. search for 'zxxzcxczxcx')
            //   * Location doesn't map to address (e.g. click in middle of Atlantic)

            if (type == 'address') {
                // User has typed in an address which we can't geocode to a location
                $('#gmaps-error').html("Sorry! We couldn't find " + value + ". Try a different search term, or click the map.");
                $('#gmaps-error').show();
            } else {
                // User has clicked or dragged marker to somewhere that Google can't do a reverse lookup for
                // In this case we display a warning, clear the address box, but fill in LatLng
                $('#gmaps-error').html("Woah... that's pretty remote! You're going to have to manually enter a place name.");
                $('#gmaps-error').show();
                update_ui('', value)
            }
        };
    });
};

// initialise the jqueryUI autocomplete element
function autocomplete_init() {
    $("#gmaps-input-address").autocomplete({

        // source is the list of input options shown in the autocomplete dropdown.
        // see documentation: http://jqueryui.com/demos/autocomplete/
        source: function(request, response) {

            // the geocode method takes an address or LatLng to search for
            // and a callback function which should process the results into
            // a format accepted by jqueryUI autocomplete
            geocoder.geocode({
                'address': request.term
            }, function(results, status) {
                response($.map(results, function(item) {
                    return {
                        label: item.formatted_address, // appears in dropdown box
                        value: item.formatted_address, // inserted into input element when selected
                        geocode: item // all geocode data: used in select callback event
                    }
                }));
            })
        },

        // event triggered when drop-down option selected
        select: function(event, ui) {
            update_ui(ui.item.value, ui.item.geocode.geometry.location)
            update_map(ui.item.geocode.geometry)
        }
    });

    // triggered when user presses a key in the address box
    $("#gmaps-input-address").bind('keydown', function(event) {
        if (event.keyCode == 13) {
            geocode_lookup('address', $('#gmaps-input-address').val(), true);

            // ensures dropdown disappears when enter is pressed
            $('#gmaps-input-address').autocomplete("disable")
        } else {
            // re-enable if previously disabled above
            $('#gmaps-input-address').autocomplete("enable")
        }
    });
}; // autocomplete_init

function showPrice() {
    var coords = [{
        lat: 41.378134,
        lng: 2.157709
    }, {
        lat: 41.383165,
        lng: 2.150757
    }, {
        lat: 41.387069,
        lng: 2.158160
    }, {
        lat: 41.378134,
        lng: 2.162580
    }];
    var price = new google.maps.Polygon({
        paths: coords,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
    });
    price.setMap(map);
};




function showQuiet() {
    var coords = [{
        lat: 41.399154,
        lng: 2.130923
    }, {
        lat: 41.406340,
        lng: 2.123745
    }, {
        lat: 41.410605,
        lng: 2.129442
    }, {
        lat: 41.404184,
        lng: 2.136738
    }, {
        lat: 41.390204,
        lng: 2.127361
    }, {
        lat: 41.398505,
        lng: 2.102900
    }, {
        lat: 41.401853,
        lng: 2.120267
    }];
    var quiet = new google.maps.Polygon({
        paths: coords,
        strokeColor: '#6699ff',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#6699ff',
        fillOpacity: 0.35
    });

    quiet.setMap(map);
    quiet.addListener('click', showArrays);

    infoWindow = new google.maps.InfoWindow;
};

function showTransport() {
    var coords = [{
        lat: 41.392393,
        lng: 2.136910
    }, {
        lat: 41.388832,
        lng: 2.140535
    }, {
        lat: 41.386766,
        lng: 2.156102
    }, {
        lat: 41.384168,
        lng: 2.170539
    }, {
        lat: 41.398819,
        lng: 2.166622
    }];
    var trans = new google.maps.Polygon({
        paths: coords,
        strokeColor: '#40DB64',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#40DB64',
        fillOpacity: 0.35
    });
    trans.setMap(map);
};

function showSafe() {
    var coords = [{
        lat: 41.392614,
        lng: 2.127193
    }, {
        lat: 41.385014,
        lng: 2.131684
    }, {
        lat: 41.389994,
        lng: 2.146351
    }, {
        lat: 41.393696,
        lng: 2.141587
    }];
    var safe = new google.maps.Polygon({
        paths: coords,
        strokeColor: '#DBD82C',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#DBD82C',
        fillOpacity: 0.35
    });
    safe.setMap(map);
};

function showArrays(event) {

    var vertices = this.getPath();

    var contentString = '<div style="font-size:18px;font-weight:bold;padding-left:10px;">La zona que buscas:</div><br>' +
        '<p style="padding-left:10px;">Es la zona más tranquila</p>';
    contentString += '<br> *En base a la opinión de los usuarios';

    var priceContent = 'Hola';

    infoWindow.setContent(contentString);
    infoWindow.setPosition(event.latLng);

    infoWindow.open(map);
}



$(document).ready(function() {
    if ($('#gmaps-canvas').length) {
        gmaps_init();
        autocomplete_init();
    }
});
