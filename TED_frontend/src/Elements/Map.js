import React from "react"
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';


class Map extends React.Component {
  constructor() {
    super()
    this.state = {
      zoom: 13
    }
  }

  render() {
    const position = [this.props.lat, this.props.lon]
    console.log("position: ", position)
    return (
        <LeafletMap center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
          />
          <Marker position={position}>
            <Popup>
              {this.props.lat}, {this.props.lon}
            </Popup>
          </Marker>
        </LeafletMap>
    );
  }
}

export default Map