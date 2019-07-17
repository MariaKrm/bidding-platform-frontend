import React, { Component } from "react";
import PropTypes from "prop-types";

export default class LocationResult extends Component {
	constructor(props) {
		super(props);
		this.maxCharsResult = 25;
		this.handleClick = this.handleClick.bind(this);
	}
	
	handleClick(event) {
		event.stopPropagation();
		this.props.setLocation(this.props.location);
		this.props.closeTab();
	}
	
	renderDistance() {
		const { location: { distance }  } = this.props;
		if (distance < 1000) return `${distance} m`;
		if (distance < 10000) return `${Math.round(distance/100)/10} km`;
		return `${Math.round(distance/1000)} km`;
	}
	
	renderIcon() {
		const { location: { category }} = this.props;
		switch (category) {
		case "education-facility": return <i className="fas fa-graduation-cap"/>;
		case "shop": return <i className="fas fa-store"/>;
		case "electronics-shop": return <i className="fas fa-store"/>;
		case "kiosk-convenience-store": return <i className="fas fa-store"/>;
		case "restaurant": return <i className="fas fa-utensils"/>;
		case "public-transport": return <i className="fas fa-bus"/>;
		case "ev-charging-station": return <i className="fas fa-charging-station"/>;
		case "administrative-region": return <i className="fas fa-globe"/>;
		case "city-town-village": return <i className="fas fa-city"/>;
		case "government-community-facility": return <i className="fas fa-landmark"/>;
		case "petrol-station": return <i className="fas fa-gas-pump"/>;
		case "hotel": return <i className="fas fa-concierge-bell"/>;
		case "sports-facility-venue": return <i className="fas fa-running"/>;
		default: return <i className="fas fa-location-arrow"/>;
		}
	}
	
	renderTitle() {
		if (this.props.location.title.length > this.maxCharsResult) {
			return this.props.location.title.slice(0, this.maxCharsResult)+"...";
		}
		return this.props.location.title;
	}
	
	render() {
		return <div className={"location-result"} onClick={this.handleClick}>
			<span><span className={"icon"}>{this.renderIcon()}</span>{this.renderTitle()}</span>
			<span>{this.renderDistance()}</span>
		</div>;
	}
}

LocationResult.propTypes = {
	location: PropTypes.shape({
		title: PropTypes.string,
		distance: PropTypes.number
	}).isRequired,
	setLocation: PropTypes.func.isRequired,
	closeTab: PropTypes.func.isRequired
};
