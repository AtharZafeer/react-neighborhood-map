import React, { Component } from 'react';

class ListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: ''
    };
  }
  render() {
    return (
      <div className="list-view">
        <h2>Manhattan's Museums</h2>
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
        <ul>
          {this.props.places ? (
            this.props.places.map(place => {
              return (
                <li key={place.id}><button class='button' type="button">{place.name}</button></li>
              )
            })
          ): (
            <li>loading</li>
          )}
        </ul>
      </div>
    )
  }
}

export default ListView;
