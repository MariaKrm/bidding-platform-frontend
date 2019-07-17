import React, { Component, Fragment } from "react";
import UploadAndEdit from "../UploadAndEdit";
import { request } from "../utils";
import PropTypes from "prop-types";
import LocationSearch from "../Elements/LocationSearch";
import Swal from "sweetalert2";
import Checkbox from "react-simple-checkbox";

class LinkInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			adLink: ""
		};
		
		this.timer = null;
		
		this.delay = 250;
		
		this.handleInput = this.handleInput.bind(this);
	}
	
	handleInput(event) {
		event.persist();
		const { name: key, value } = event.target;
		this.setState({
			[key]: value
		}, () => {
			if (this.timer) {
				clearTimeout(this.timer);
			}
			setTimeout(() => this.validateLink(event), this.delay);
		});
	}
	
	validateLink(event) {
		const regEx = /[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi;
		if (!regEx.test(this.state.adLink)) {
			return this.setState({ error: "Invalid format link provided"});
		}
		this.setState({ error: null });
		this.props.onInput(event);
	}
	
	render() {
		return <div className={["productLink", this.state.error ? "error" : null].join(" ")}>
			<span>Link to the production homepage:</span>
			<textarea name={"adLink"} onInput={this.handleInput} placeholder="Write the link of your product's home page"/>
			{this.state.error && <span className={"error"}>{this.state.error}</span>}
		</div>;
	}
}

LinkInput.propTypes = {
	onInput: PropTypes.func.isRequired
};

export default class NewAdv extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: "",
			caption: "",
			modified: false,
			location: null,
			lastSent: Date.now(),
			scheduled: false,
			publicationDate: null,
			adLink: null
		};


		this.postButton = React.createRef();
		this.uploadAndEdit = React.createRef();

		this.handlePostAd = this.handlePostAd.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.handleModified = this.handleModified.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.setLocation = this.setLocation.bind(this);
		this.assembleFormData = this.assembleFormData.bind(this);

		this.handleScheduling = this.handleScheduling.bind(this);
	}

	handleInput(event) {
		let { name: key, value } = event.target;
		if (key === "publicationDate") {
			value = new Date(value).getTime();
		}
		this.setState({
			[key]: value
		});
	}

	closeModal() {
		this.props.setModal(false);
	}

	handleModified(value) {
		this.setState({ modified: value });
	}
	
	setLocation(location) {
		this.setState({ location });
	}
	
	handleScheduling(isChecked){
		if (!isChecked) {
			return this.setState({
				scheduled: isChecked,
				publicationDate: null
			});
		}
		this.setState({
			scheduled: isChecked
		});
	}
	
	parseLocation() {
		if (!this.state.location) return {};
		const { id: apiIdentifier, title: locationTitle, category: locationType, position } = this.state.location;
		const [ latitude, longitude ] = position;
		return {
			apiIdentifier,
			locationTitle,
			locationType,
			longitude,
			latitude
		};
	}
	
	assembleFormData(media) {
		let data = Object.assign({media}, this.state);
		delete data.lastSent;
		delete data.location;
		delete data.modified;
		delete data.scheduled;
		if (!this.state.publicationDate) {
			delete data.publicationDate;
		}
		if (this.state.location) {
			data = Object.assign(data, this.parseLocation(this.state.location));
		}
		return data;
	}

	handlePostAd(file) {
		if (Date.now() - this.state.lastSent < 1000) return;
		this.setState({ lastSent: Date.now() });

		const formData = new FormData();
		const data = this.assembleFormData(file);
		if (data.caption.trim() !== "" && data.title.trim() === "") return this.renderError("400: Must provide a title along with a description.");
		Object.keys(data).forEach(key => {
			formData.append(key, data[key]);
		});
		request.send("POST", "/post", formData).then(() => {
			this.props.setModal(false);
			Swal.fire({
				type: "success",
				title: "Success",
				text: "Your ad was successfully posted!",
			});
		}).catch(err => {
			if (!err.response) return;
			this.renderError(err.response.data.text);
		});
	}

	handleClick() {
		this.uploadAndEdit.current.getImageFromUploaderAndEditor(file => this.handlePostAd(file));
	}

	renderError(text) {
		Swal.fire({
			type: "error",
			title: "Oops...",
			text,
		});
	}
	
	checkRequirements() {
		return this.state.modified && this.state.adLink && this.state.adLink.trim() !== "";
	}
	
	render() {
		return (<Fragment>
			<div className="left">
				<div className={"photo-container"}>
					<UploadAndEdit width={350} height={350} ref={this.uploadAndEdit} exts={["PNG", "JPEG", "MP4", "WMV", "FLV"]} handleModified={this.handleModified} />
				</div>
			</div>
			<div className={"info-container"}>
				<div className="info">
					<div className={"title"}>
						<span>Title:</span>
						<textarea placeholder="An interesting title..." name={"title"} onInput={this.handleInput}/>
					</div>
					<LocationSearch setLocation={this.setLocation}/>
					<div className={"caption"}>
						<span>Description:</span>
						<textarea placeholder="...and an amazing description!" name={"caption"} onInput={this.handleInput}/>
					</div>
					<LinkInput onInput={this.handleInput}/>
					<div className={"schedule"}>
						<span>Scheduling? <p>(Leave it unchecked if you do not want to schedule your adv.)</p></span>
						<div className="set-schedule">
							<Checkbox
								id ={"Scheduling"}
								onChange = {this.handleScheduling}
								size = {2}
								checked = {this.state.scheduled}
							/>
							{this.state.scheduled && <div><span>Choose a date and set a time</span><input name="publicationDate" type="datetime-local" onInput={this.handleInput}/></div>}
						</div>
					</div>
					<button className={"post-btn"} ref={this.postButton} disabled={!this.checkRequirements()} onClick={this.handleClick}>POST</button>
				</div>
			</div>
			<div className="close-btn">
				<i className="fas fa-times-circle" onClick={this.closeModal}/>
			</div>
		</Fragment>
		);
	}

}

NewAdv.propTypes = {
	setModal: PropTypes.func.isRequired,
};



