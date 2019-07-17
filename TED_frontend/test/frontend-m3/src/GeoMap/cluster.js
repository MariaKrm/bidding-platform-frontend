import { Children, createElement, PureComponent } from "react";
import Supercluster from "supercluster";
import { point } from "@turf/helpers";
import { Marker } from "react-map-gl";
import PropTypes from "prop-types";


const childrenKeys = children =>
	Children.toArray(children).map(child => child.key);

const shallowCompareChildren = (prevChildren, newChildren) => {
	if (Children.count(prevChildren) !== Children.count(newChildren)) {
		return false;
	}
	
	const prevKeys = childrenKeys(prevChildren);
	const newKeys = new Set(childrenKeys(newChildren));
	return (
		prevKeys.length === newKeys.size && prevKeys.every(key => newKeys.has(key))
	);
};


export default class Cluster extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			clusters: []
		};
		
		this.createCluster = this.createCluster.bind(this);
		this.recalculate = this.recalculate.bind(this);
	}
	
	componentDidMount() {
		this.createCluster(this.props);
		this.recalculate();
		
		this.props.map.on("moveend", this.recalculate);
	}
	
	UNSAFE_componentWillReceiveProps(newProps) {
		const shouldUpdate =
			newProps.minZoom !== this.props.minZoom ||
			newProps.maxZoom !== this.props.maxZoom ||
			newProps.radius !== this.props.radius ||
			newProps.extent !== this.props.extent ||
			newProps.nodeSize !== this.props.nodeSize ||
			!shallowCompareChildren(this.props.children, newProps.children);
		if (shouldUpdate) {
			this.createCluster(newProps);
			this.recalculate();
		}
	}
	
	createCluster(props) {
		const {
			minZoom,
			maxZoom,
			radius,
			extent,
			nodeSize,
			children,
			innerRef,
		} = props;
		
		const cluster = new Supercluster({
			minZoom,
			maxZoom,
			radius,
			extent,
			nodeSize,
		});
		
		const points = Children.map(children, child => {
			if (child)
				return point([child.props.longitude, child.props.latitude], child);
			return null;
		});
		cluster.load(points);
		this.cluster = cluster;
		if (innerRef) innerRef(this.cluster);
		
	}
	
	recalculate() {
		const zoom = this.props.map.getZoom();
		const bounds = this.props.map.getBounds();
		const bbox = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth() ];
		const clusters = this.cluster.getClusters(bbox, Math.floor(zoom));
		this.setState({ clusters });
	}
	
	render() {
		return this.state.clusters.map(cluster => {
			if (cluster.properties.cluster) {
				const [longitude, latitude] = cluster.geometry.coordinates;
				return createElement(Marker, {
					longitude,
					latitude,
					// TODO size
					offsetLeft: -28 / 2,
					offsetTop: -28,
					children: createElement(this.props.element, {
						cluster,
						superCluster: this.cluster,
						goToViewport: this.props.goToViewport
					}),
					key: `cluster-${cluster.properties.cluster_id}`,
				});
			}
			const { type, key, props } = cluster.properties;
			return createElement(type, { key, ...props });
		});
	}
	
	
}

Cluster.propTypes = {
	element: PropTypes.element,
	goToViewport: PropTypes.func.isRequired,
	map: PropTypes.object,
	minZoom: PropTypes.number,
	maxZoom: PropTypes.number,
	radius: PropTypes.number,
	extent: PropTypes.number,
	nodeSize: PropTypes.number,
	children: PropTypes.arrayOf(PropTypes.element)
};
