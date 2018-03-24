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
