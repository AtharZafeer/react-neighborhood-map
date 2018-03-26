import React, { Component } from 'react';
import poweredByFoursquare from '../images/foursquare.png'

class ListView extends Component {
  constructor(props) {
    super(props);
    this.openMarker = this.openMarker.bind(this);
    this.state = {
      query: ''
    };
  }
  openMarker(e) {
      this.props.markers.map(marker => {
        if (e.target.value === marker.name) {
          this.props.infoWindows.map(infoWindow => {
            if (marker.name === infoWindow.name) {
              console.log(infoWindow.name);
              infoWindow.open(this.props.map, marker);
            }
          })
        }
      })
  }
  render() {
    return (
      <div className="list-view">
        <h1>Manhattan's Museums</h1>
        <input
          type="text"
          placeholder="Search Museums"
          value={ this.state.query }
          onChange={(event) => {
            this.setState({ query: event.target.value });
            this.props.settingQuery(event.target.value)}
          }
          role="search"
          aria-labelledby="text filter"/>
        <ul id="list">
          {this.props.places ? (
            this.props.places.map(place => {
              return (
                <li key={place.id}><button className='button' type="button" onClick={this.openMarker} value={place.name}>{place.name}</button></li>
              )
            })
          ): (
            <li>loading</li>
          )}
        </ul>
        <img src={poweredByFoursquare} alt="Powered by foursquare"/>
      </div>
    )
  }
}

export default ListView;
