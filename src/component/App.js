import React, { Component } from 'react';
import '../App.css';
import ListView from './ListView'
import scriptLoader from 'react-async-script-loader';
import {createFilter} from 'react-search-input';

var markers = [];
var infoWindows = [];

class App extends Component {
  constructor(props) {
    super(props);
    this.loadMap = this.loadMap.bind(this);
    this.state = {
      markers: [],
      infoWindows: [],
      places: [],
      map: {},
      query: ''
    }
  }

  componentWillReceiveProps({isScriptLoadSucceed}){
    if (isScriptLoadSucceed) {
      // initiating the location and the map and giving these objects to the loadMap function.
      var map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: new window.google.maps.LatLng(40.762026,-73.984096)
      });
      this.setState({map});
      this.loadMap(map)
    }
    else {
      console.log("google maps API couldn't load.");
    }
  }

  loadMap(map) {
    var CORSRequest = this.createCORSRequest('GET',"https://api.foursquare.com/v2/venues/search?ll=40.762026,-73.984096&query=museum&radius=2000&categoryId=4bf58dd8d48988d181941735&client_id=CFSMRM4YK0LMFIZIOO1ETN50A1TXPJENSO3EUOIEBXK3E5ER&client_secret=YJQZ5FTKIA5UHUDU2BNACLRW14WZBDQLOO0KIWNSBUC2QN4V&v=20201215");
    CORSRequest.onload = () => {
      const filteredPlaces = JSON.parse(CORSRequest.responseText).response.venues.filter(createFilter(this.state.query, ['name', 'location.address']))
      this.setState({ places: filteredPlaces });
      markers.forEach(m => { m.setMap(null) });
      markers = [];
      infoWindows = [];
      filteredPlaces.map(place => {
        var contentString =
        `<div class="infoWindow">
          <h1>${place.name}</h1>
          <h2>${place.location.address ? place.location.address : place.location.formattedAddress[0]}</h2>
          <h3>${place.contact.formattedPhone? place.contact.formattedPhone : "phone number not available"}</h3>
          <p>${place.stats.checkinsCount} people have been here.</p>
          ${place.url ? "<a href=" + place.url + ">Go to official website</a>" : ""}
        </div>`

        var infoWindow= new window.google.maps.InfoWindow({
          content: contentString,
          name: place.name
        });
        var marker = new window.google.maps.Marker({
          map: map,
          position: place.location,
          animation: window.google.maps.Animation.DROP,
          name : place.name
        });
        marker.addListener('click', function() {
          infoWindow.open(map, marker);
          if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
          } else {
            marker.setAnimation(window.google.maps.Animation.BOUNCE);
            setTimeout(() => {marker.setAnimation(null);}, 300)
          }
        });
        marker.addListener('click', function() {
          infoWindow.open(map, marker);
        });
        markers.push(marker);
        infoWindows.push(infoWindow);
        this.setState({markers})
        this.setState({infoWindows})
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

  // queryHandler takes the query from the ListView sets the state and reloads the maps.
  queryHandler(query) {
    this.setState({query});
    this.loadMap(this.state.map);
  }


  render() {
    return (
      <div id="container">
        <div id="map-container">
          <div id="map"></div>
        </div>
        <ListView
          places={this.state.places}
          settingQuery={(query) => {this.queryHandler(query)}}
          markers={this.state.markers}
          infoWindows={this.state.infoWindows}
          map={this.state.map}/>
      </div>
    )
  }
}

export default scriptLoader(
    [`https://maps.googleapis.com/maps/api/js?key=AIzaSyD_IeWHOd2g_nP9hz6o2ZdgHTVtfYinxZk&libraries=places`]
)(App);
