import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ClusterMarker extends Component {
	constructor(props) {
		super(props);
		this.nChildren = this.props.cluster.properties.point_count;
		this.clusterRef = React.createRef();
		this.handleClick = this.handleClick.bind(this);
	}
	
	handleClick(event) {
		event.preventDefault();
		const [longitude, latitude] = this.props.cluster.geometry.coordinates;
		const { cluster_id: id } = this.props.cluster.properties;
		const zoom = this.props.superCluster.getClusterExpansionZoom(id);
		this.props.goToViewport({longitude, latitude, zoom});
	}
	
	chooseSize() {
		const ratio = this.nChildren / this.props.nPoints;
		if (ratio === 1) {
			return "biggest";
		}
		if (ratio > 0.5) {
			return "big";
		}
		if (ratio > 0.25) {
			return "normal";
		}
		if (ratio > 0.125) {
			return "small";
		}
		if (ratio > 0.0625) {
			return "tiny";
		}
		return "smallest";
	}

	render() {
		return <div
			ref={this.clusterRef}
			className={`cluster-marker size-${this.chooseSize()}`}
			onClick={this.handleClick}
		>
			<span>
				{this.nChildren}
			</span>
		</div>;
	}
}

ClusterMarker.propTypes = {
	nPoints: PropTypes.number,
	cluster: PropTypes.shape({
		cluster: PropTypes.object,
		properties: PropTypes.object,
		geometry: PropTypes.shape({
			coordinates: PropTypes.object
		})
	}),
	superCluster: PropTypes.shape({
		getClusterExpansionZoom: PropTypes.func.isRequired
	}),
	goToViewport: PropTypes.func.isRequired
};
