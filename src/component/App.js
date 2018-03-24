import React, { Component } from 'react';
import '../App.css';
import ListView from './ListView'
import scriptLoader from 'react-async-script-loader';


class App extends Component {
  constructor(props) {
    super(props);
    this.loadMap = this.loadMap.bind(this);
    this.state = {
      places: [],
      openInfoWindow: "",
    }
  }

  componentWillReceiveProps({isScriptLoadSucceed}){
    if (isScriptLoadSucceed) {
      this.loadMap()
    }
    else {
      alert("script not loaded")
    }
  }

  loadMap() {
    var sultanAhmet = new window.google.maps.LatLng(40.762026,-73.984096);
    var map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: sultanAhmet
    });

    var CORSRequest = this.createCORSRequest('GET',"https://api.foursquare.com/v2/venues/search?ll=40.762026,-73.984096&query=museum&radius=2000&categoryId=4bf58dd8d48988d181941735&client_id=CFSMRM4YK0LMFIZIOO1ETN50A1TXPJENSO3EUOIEBXK3E5ER&client_secret=YJQZ5FTKIA5UHUDU2BNACLRW14WZBDQLOO0KIWNSBUC2QN4V&v=20201215");
    CORSRequest.onload = () => {
      this.setState({ places: JSON.parse(CORSRequest.responseText).response.venues })
      this.state.places.map(place => {
        var contentString =
        `<div class="infoWindow">
          <img src=${place.categories.prefix}.${place.categories.suffix} alt=${place.name}'s image'>
          <h1>${place.name}</h1>
          <h2>${place.location.address}</h2>
          <h3>${place.contact.formattedPhone? place.contact.formattedPhone : "phone number not available"}</h3>
          <p>${place.stats.checkinsCount} people have been here.</p>
          <a href=${place.url}>read more</a>
        </div>`

        var infowindow = new window.google.maps.InfoWindow({
          content: contentString
        });

        var marker = new window.google.maps.Marker({
          map: map,
          position: place.location,
          name : place.name
        });
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });



      })
    };
    CORSRequest.send();

  }

  // Used the tutorial in https://www.html5rocks.com/en/tutorials/cors/ to create a CORS request function.
  createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
      // Check if the XMLHttpRequest object has a "withCredentials" property.
      // "withCredentials" only exists on XMLHTTPRequest2 objects.
      xhr.open(method, url, true);
    } else if (typeof XDomainRequest !== "undefined") {
      // Otherwise, check if XDomainRequest.
      // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
      xhr = new XDomainRequest();
      xhr.open(method, url);

    } else {
      // Otherwise, CORS is not supported by the browser.
      xhr = null;
    }
    return xhr;
  }


  render() {
    return (
      <div id="container">
        <div id="map-container">
          <div id="map"></div>
        </div>
        <ListView places={this.state.places}/>
      </div>
    )
  }
}

export default scriptLoader(
    [`https://maps.googleapis.com/maps/api/js?key=AIzaSyD_IeWHOd2g_nP9hz6o2ZdgHTVtfYinxZk&libraries=places`]
)(App);
