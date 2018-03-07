
"use strict";

// the list of the locations that will be shown to the user ( the model)
var locations = [
  {title: 'Cairo tower', location: {lat: 30.045949, lng: 31.224291}, foursquareId: '506efd98e4b0723f1c418f03'},
  {title: 'Egyptian Musem in Cairo', location: {lat: 30.047914, lng: 31.233633}, foursquareId: '4b653727f964a5203ee92ae3'},
  {title: 'Musem of Islamic Art in cairo', location: {lat: 30.044393, lng: 31.252367},
   foursquareId: '52bac45a498ea00ff836da80'},
  {title: 'Tahrir square', location: {lat: 30.044467, lng: 31.235738}, foursquareId: '5428a85f498e2e36b5c953f9'},
  {title: 'Embassy Of The United States Of America', location: {lat: 30.041179, lng: 31.233627},
   foursquareId: '4ec2161cb6341cd41fc0104d'},
  {title: 'Cairo opera House', location: {lat: 30.042791, lng: 31.224365}, foursquareId: '512bc1dde4b0067bb70e2eab'},
  {title: 'Embassy Of The Federal Repuplic Of Germany', location: {lat: 30.055054, lng: 31.219172},
   foursquareId: '4c1dac76eac020a1e5b148c2'}
];


// initializing the google map
var map;
var marker;
var markers = [];
function initMap(){

// this style from udacity nano degree course about google maps
  var styles = [
          {
            featureType: 'water',
            stylers: [
              { color: '#19a0d8' }
            ]
          },{
            featureType: 'administrative',
            elementType: 'labels.text.stroke',
            stylers: [
              { color: '#ffffff' },
              { weight: 6 }
            ]
          },{
            featureType: 'administrative',
            elementType: 'labels.text.fill',
            stylers: [
              { color: '#e85113' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [
              { color: '#efe9e4' },
              { lightness: -40 }
            ]
          },{
            featureType: 'transit.station',
            stylers: [
              { weight: 9 },
              { hue: '#e85113' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'labels.icon',
            stylers: [
              { visibility: 'off' }
            ]
          },{
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [
              { lightness: 100 }
            ]
          },{
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [
              { lightness: -100 }
            ]
          },{
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [
              { visibility: 'on' },
              { color: '#f0e4d3' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [
              { color: '#efe9e4' },
              { lightness: -25 }
            ]
          }
        ];

  map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 30.043682 , lng: 31.224430},
    zoom: 15,
    styles: styles,
    mapTypeControl: false
  });

  ko.applyBindings(new ViewModel());

  } // end of initMap() function


// this function will alert the user of the error
function onError() {
  alert("An error has been occured, please try again");
  }


  var  getStreetView = function(data,status){};
// this function will show the InfoWindow when the marker is clicked
function showTheInfoWindow(marker, infowindow) {
  if(infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('');
      // remove the marker property of the infowindow when it's closed
      infowindow.addListener('closeclick', function(){
        infowindow.setMarker = null;
      });

      var streetviewService = new google.maps.StreetViewService();
      var radius = 50;

      // function to compute the heading, if the status is ok then the panorama(pano) was found
      // it will compute the position of the streetview image, then after calculating the heading
      // we will get the panorama from that and set the options
      // Hint: this code from udacity google maps course
       getStreetView = function(data, status) {
          if (status == google.maps.StreetViewStatus.OK) {
            var nearStreetViewLocation = data.location.latLng;
            var heading = google.maps.geometry.spherical.computeHeading(
              nearStreetViewLocation, marker.position);
              infowindow.setContent('<div>' + marker.title + '</div><div id="rating">Foursquare Rating: '+marker.rating+'</div><div id="pano"></div>');
              var panoramaOptions = {
                position: nearStreetViewLocation,
                pov: {
                  heading: heading,
                  pitch: 40
                }
              };
            var panorama = new google.maps.StreetViewPanorama(
              document.getElementById('pano'), panoramaOptions);
          } else {
            infowindow.setContent('<div>' + marker.title + '</div>' +
              '<div>No Street View Found</div><div id="rating">Foursquare Rating: '+marker.rating+'</div>');
          }
        }; // end of getStreetView() function

      // we will use the street view service to get the closest streetview image within
      // 50 meters of the marker position
      streetviewService.getPanoramaByLocation(marker.position, radius, getStreetView);
      // open the infowindow of the marker
      infowindow.open(map, marker);
  }




} // end of showInfoWindow() function

function makeMarkerIcon(markerColor) { //passing marker color and building marker icon in this function
        var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34), //size of marker height and widh
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34), //accuracy where they are pointing .
            new google.maps.Size(21, 34));
        return markerImage;
    }

var ViewModel = function() {



  var theInfoWindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();


  // defining icons color for the markers
  var defaultIcon = makeMarkerIcon('29db04');
  // make another color for the marker when the user hover over the marker
  var highLightedIcon= makeMarkerIcon('91042f');
  // iterating over the locations we have and assign a marker for each location
  for(var i=0; i<locations.length; ++i) {
    var position = locations[i].location;
    var title = locations[i].title;
    var animation = google.maps.Animation.DROP;

    // create a marker for each location and put it in the markers[]
     marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: animation,
      icon: defaultIcon,
      venue: locations[i].foursquareId,
      rating: '',
      id: i,
      display: ko.observable(true)
    });

    // pushing the marker to the marker[]
    markers.push(marker);
    // create onclick event to open an infowindow for each marker by clicking on it
    marker.addListener('click', markerClickListener(marker, theInfoWindow));


    // event liteners for changing the marker colors
    marker.addListener('mouseover', markerMouseOver(marker, highLightedIcon));

    marker.addListener('mouseout', markerMouseOut(marker, defaultIcon));
    bounds.extend(markers[i].position);

  } // end of for loop

// a callback function for marker clicklitener
function markerClickListener(marker, theInfoWindow) {
  return function() {
    showTheInfoWindow(marker, theInfoWindow);
    makeMeBounce(marker);
  };
}

// a callback functions for mouseover and mouseout litener
function markerMouseOver(marker, highLightedIcon){
  return function() {
    marker.setIcon(highLightedIcon);
  };
}

function markerMouseOut(marker, defaultIcon) {
  return function() {
    marker.setIcon(defaultIcon);
  };
}

  // function to show windowinfo of a marker when user clicks on place name in the list
  this.showMarker = function(marker) {
    showTheInfoWindow(marker, theInfoWindow);
    makeMeBounce(marker);
  };

  // function to make markers bounce
  function makeMeBounce(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    window.setTimeout(function(){
      marker.setAnimation(null);
    }, 1400);
  }

  map.fitBounds(bounds);


  // getting the rating of each marker
  markers.forEach(function(marker) {
    // AJAX request for foursquare API
    $.ajax({
      method: 'GET',
      dataType: 'json',
      url: "https://api.foursquare.com/v2/venues/" + marker.venue + "?client_id=K045K5J2JL5JPXX1ORNQ2LMV2ZHR000KBGFD4Q4ZEMADJF4N&client_secret=UPYX2VZCQHNCFK0SPAUOAQD5NNC4OE0RK21V4ZVT0TXSEWUJ&v=20180306",
      success: function(data) {
        var venue = data.response.venue;
        if(venue.hasOwnProperty('rating')){
          marker.rating = venue.rating;
        } else {
          marker.rating = 'No rating found';
        }
      },
      error: function() {
        alert("something went wrong");
      }
    });
  });



  this.places = ko.observableArray(locations);
  this.inputText = ko.observable('');
  this.filterPlaces = function() {
    theInfoWindow.close(); // to close any previously opened infowindow
    var textBox = this.inputText();
    if(textBox.length === 0){ // if the input text is empty
      this.showAllPlaces(true);
    } else {
      for(var i=0; i<markers.length; ++i) {
        if(markers[i].title.toLowerCase().indexOf(textBox.toLowerCase()) > -1){
          markers[i].display(true);
          markers[i].setVisible(true);
        } else {
          markers[i].display(false);
          markers[i].setVisible(false);
        }
      }
    }
      theInfoWindow.close();
  };

  // function to toggle the visibility of the markers
  this.showAllPlaces = function(flag) {
    for(var i=0; i<markers.length; ++i) {
      markers[i].display(flag);
      markers[i].setVisible(flag);

    }

  };

};
