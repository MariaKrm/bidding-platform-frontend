import React, { Component } from "react";
import ReactMapGL, {Marker, GeolocateControl, FlyToInterpolator, NavigationControl} from "react-map-gl";
import { point } from "@turf/helpers";
import Cluster from "./cluster";
import ClusterMarker from "./clusterMarker";
import PostMarker from "./postMarker";
import PropTypes from "prop-types";

class Map extends Component {
	constructor(props) {
		super(props);
		this.state = {
			viewport: {
				width: "100%",
				height: "80vh",
				latitude: 45,
				longitude: 0,
				zoom: 3,
			},
			map: null,
			points: [],
			nPoints: 0
		};

		this.mapRef = React.createRef();

		this.onViewportChange = this.onViewportChange.bind(this);
		this.goToViewport = this.goToViewport.bind(this);
		this.loadPosts = this.loadPosts.bind(this);
	}



	goToViewport({longitude, latitude, zoom}) {
		this.onViewportChange({
			longitude: longitude || this.state.longitude,
			latitude: latitude || this.state.latitude,
			zoom: (zoom + 0.01) || this.state.zoom,
			transitionInterpolator: new FlyToInterpolator(),
			transitionDuration: 750
		});
	}

	onViewportChange(viewport) {
		this.setState({ viewport });
	}
	
	static spreadPostFrom(long, lat) {
		const deg = Math.floor(Math.random() * 360);
		const dist = Math.random()/20000;
		return [long+dist*Math.cos(deg), lat+dist*Math.sin(deg)];
	}
	
	
	loadPosts() {
		const points = [];
		this.props.posts.forEach(post => {
			if (!post.location) return;
			const position = point(Map.spreadPostFrom(post.location.longitude, post.location.latitude));
			position.postId = post.id;
			points.push(position);
		});
		this.setState({ points, nPoints: points.length });
	}

	componentDidMount() {
		this.loadPosts();
		document.querySelectorAll(".map .mapboxgl-control-container div").forEach(div => {
			div.parentNode.removeChild(div);
		});
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const points = [];
		nextProps.posts.forEach(post => {
			if (!post.location) return;
			const position = point(Map.spreadPostFrom(post.location.longitude, post.location.latitude));
			position.properties.postId = post.id;
			points.push(position);
		});
		this.setState({ points, nPoints: points.length });
	}



	render() {
		return (
			<div className={"map"}>
				<ReactMapGL
					{...this.state.viewport}
					ref={this.mapRef}
					onLoad={() => this.setState({ map: this.mapRef.current.getMap() }   )}
					mapStyle="mapbox://styles/mapbox/dark-v9"
					mapboxApiAccessToken={"pk.eyJ1IjoiYXJvbWFuOTQiLCJhIjoiY2p0dWFkeXpkMGY5czN5b2FkejB4YXgzeCJ9.5P4EqdClOgw6Ldqb45peow"}
					onViewportChange={this.onViewportChange}

				>
					<GeolocateControl
						onViewportChange={this.onViewportChange}
						positionOptions={{enableHighAccuracy: true}}
						trackUserLocation={true}
						offsetLeft={-16}
						offsetTop={-16}
					/>
					<NavigationControl onViewportChange={this.onViewportChange} />
					{this.state.map && (
						<Cluster
							minZoom={0}
							maxZoom={16}
							map={this.state.map}
							radius={20}
							extent={512}
							nodeSize={64}
							goToViewport={this.goToViewport}
							element={clusterProps => (
								<ClusterMarker nPoints={this.state.nPoints} {...clusterProps}/>
							)}
						>
							{this.state.points.map((point, i) => {
								const [longitude, latitude] = point.geometry.coordinates;
								return <Marker key={i} latitude={latitude} longitude={longitude} offsetLeft={-16} offsetTop={-16}>
									<PostMarker postId={point.properties.postId}/>
								</Marker>;
							})}
						</Cluster>
					)};
				</ReactMapGL>
			</div>

		);
	}
}

Map.propTypes = {
	posts: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default Map;
