import React, { Component } from "react";
import Popover from "react-bootstrap/Popover";
import Overlay from "react-bootstrap/Overlay";
import {queryLocation, queryNearbyLocations} from "../../utils/index";
import LocationResult from "./result";
import PropTypes from "prop-types";

class UpdatingPopover extends Component {
	componentDidUpdate(prevProps) {
		if (prevProps.children !== this.props.children) {
			this.props.scheduleUpdate();
		}
	}
	
	render() {
		return <Popover {...this.props} />;
	}
}

UpdatingPopover.propTypes = {
	children: PropTypes.arrayOf(PropTypes.element),
	scheduleUpdate: PropTypes.func
};


export default class LocationSearch extends Component {
	constructor(props) {
		super(props);

		this.state ={
			showLocation: false,
			location: props.location,
			results: [],
			loading: false,
			selected: props.location !== undefined && props.location !== null,
			enabled: false
		};
		
		this.id = Math.random().toString(36).slice(2);
		
		this.queryDelay = 250;

		this.locationBox = React.createRef();

		this.handleLocationChange = this.handleLocationChange.bind(this);
		this.closeLocation = this.closeLocation.bind(this);
		this.setLocation = this.setLocation.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
	}
	
	UNSAFE_componentWillUpdate(nextProps) {
		if (nextProps.location) {
			if (this.props.location && this.props.location.locationTitle === nextProps.location.locationTitle) return;
			const { current: locationBox } = this.locationBox;
			locationBox.value = nextProps.location.locationTitle;
			this.setState({ selected: true });
		}
	}
	
	handleFocus() {
		if (this.state.selected) return;
		this.setState({ loading: true, showLocation: true });
		queryNearbyLocations().then(results => {
			results = results.slice(0, 10);
			this.setState({ loading: false, results });
		});
	}

	handleBlur() {
		if (this.state.selected) return;
		const { current: locationBox } = this.locationBox;
		locationBox.value = (this.state.location) ? this.state.location.title : "";
	}

	handleKeyDown(event) {
		if (!this.state.selected || event.keyCode !== 8) return;
		const { current: locationBox } = this.locationBox;
		locationBox.value = "";
		this.setState({ selected: false, location: null });
		if (this.props.setEnabled) this.props.setEnabled(false);
	}

	handleLocationChange(event) {
		event.persist();
		if (this.state.loading) return;
		const { value } = event.target;
		const location = value.trim();
		const showLocation = location !== "";
		this.setState({ showLocation });
		if (!showLocation) {
			if (this.props.setEnabled) this.props.setEnabled(false);
			return;
		}
		if (this.timer) {
			clearTimeout(this.timer);
		}
		this.timer = setTimeout(() => {
			this.setState({ loading: true }, () => {
				queryLocation(location).then(results => {
					results = results.slice(0, 10);
					this.setState({ results, loading: false });
				});
			});
		}, this.queryDelay);
	}

	setLocation(location) {
		const { current: locationBox } = this.locationBox;
		locationBox.value = location.title;
		this.props.setLocation(location);
		this.setState({ location, selected: true });
	}

	closeLocation() {
		if (this.state.loading) return;
		this.setState({ showLocation: false });
	}

	renderResults() {
		return this.state.results.map((result, i) => <LocationResult key={i} location={result} setLocation={this.setLocation} closeTab={this.closeLocation}/>);
	}

	render() {
		const loadClass = (this.state.loading) ? "loading" : "";
		const selectedClass = this.state.selected ? "selected" : "";
		return <div id={"locationBar"} className={[loadClass, selectedClass].join(" ")}>
			<span>Location:</span>
			<textarea
				ref={this.locationBox}
				placeholder="Write a location"
				onChange={this.handleLocationChange}
				onKeyDown={this.handleKeyDown}
				onBlur={this.handleBlur}
				onFocus={this.handleFocus}
				id={"locationText"+this.id}
			/>
			{this.state.results.length > 0 &&
				<Overlay
					target={document.getElementById("locationText"+this.id)}
					show={this.state.showLocation}
					placement="bottom"
					rootClose={true}
					onHide={this.closeLocation}
				>
					<UpdatingPopover className={"location-popover"}>
						{this.renderResults()}
					</UpdatingPopover>
				</Overlay>
			}
			{this.state.loading && <i className="fas fa-cog"/>}
		</div>;
	}
}


LocationSearch.propTypes = {
	location: PropTypes.shape({
		locationTitle: PropTypes.string
	}),
	setEnabled: PropTypes.func,
	setLocation: PropTypes.func.isRequired
};
