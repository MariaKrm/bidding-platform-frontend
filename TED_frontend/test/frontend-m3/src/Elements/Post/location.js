import {NavLink} from "react-router-dom";
import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";
import LocationSearch from "../LocationSearch";
import { request } from "../../utils";
import Swal from "sweetalert2";

export default class PostLocation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editing: false,
			location: props.location,
			changedLocation: props.location,
			enabled: props.location !== null && props.location !== undefined
		};
		
		this.handleEditClick = this.handleEditClick.bind(this);
		this.handleDeleteClick = this.handleDeleteClick.bind(this);
		this.handleConfirmClick = this.handleConfirmClick.bind(this);
		this.setLocation = this.setLocation.bind(this);
		this.setEnabled = this.setEnabled.bind(this);
	}
	
	UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState({ location: nextProps.location });
	}
	
	handleEditClick(event) {
		event.preventDefault();
		this.setState({ editing: true });
	}
	
	handleConfirmClick(event) {
		event.preventDefault();
		event.persist();
		if (!this.state.changedLocation || !this.state.changedLocation.position) return;
		const location = {
			locationTitle: this.state.changedLocation.title,
			locationType: this.state.changedLocation.category,
			apiIdentifier: this.state.changedLocation.id,
			latitude: this.state.changedLocation.position[0],
			longitude: this.state.changedLocation.position[1]
		};
		request.send("PUT", "/post/location/"+this.props.postId, location).then(res => res.data).then(() => {
			this.setState({ editing: false, location});
		});
	}
	
	handleDeleteClick(event) {
		event.preventDefault();
		event.persist();
		request.send("DELETE", "/post/location/"+this.props.postId).then(() => {
			this.setState({ editing: false, location: null });
			Swal.fire({
				type: "success",
				title: "Location removed",
				text: "The location has been removed from this post",
				timer: 2000
			});
		});
	}
	
	setLocation(location) {
		this.setState({ changedLocation: location, enabled: true });
	}
	
	setEnabled(enabled) {
		this.setState({ enabled });
	}
	
	render() {
		if (this.props.isOwnPost) return <div className={"location"}>
			{
				(this.state.editing || !this.state.location) ? <Fragment>
					<LocationSearch location={this.state.location} setLocation={this.setLocation} setEnabled={this.setEnabled}/>
					{this.state.enabled ? <button onClick={this.handleConfirmClick} className={"confirm-btn"}>
						<i className="fas fa-check"/>
					</button> : <button onClick={this.handleDeleteClick} className={"confirm-btn"}>
						<i className="fas fa-times"/>
					</button>}
				</Fragment> : <NavLink to={`/location?location=${this.state.location.locationTitle}`}>
					<i className="fas fa-map-marker-alt"/>
					{this.state.location.locationTitle}
					<button onClick={this.handleEditClick} className={"edit-btn"}>
						<i className="fas fa-edit"/>
					</button>
				</NavLink>
			}
		</div>;
		return (this.state.location) ? <div className={"location"}>
			<NavLink to={`/location?location=${this.state.location.locationTitle}`}>
				<i className="fas fa-map-marker-alt"/>
				{this.state.location.locationTitle}
			</NavLink>
		</div> : null;
	}
}

PostLocation.propTypes = {
	postId: PropTypes.number.isRequired,
	location: PropTypes.shape({
		locationTitle: PropTypes.string,
		apiIdentifier: PropTypes.string
	}),
	isOwnPost: PropTypes.bool
};
