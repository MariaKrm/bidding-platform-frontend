import React, {Component} from "react";
import UploadAndEdit from "../UploadAndEdit";
import {capitalize, request} from "../utils";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

export default class UploadStory extends Component {
	constructor(props) {
		super(props);

		this.state = {
			expiration: 10,
			modified: false,
			lastSent: Date.now()
		};

		this.uploadAndEdit = React.createRef();
		this.hours = React.createRef();
		this.minutes = React.createRef();

		this.handleModified = this.handleModified.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handlePostStory = this.handlePostStory.bind(this);
		this.assembleFormData = this.assembleFormData.bind(this);
		this.handleChangeTime = this.handleChangeTime.bind(this);
	}

	handleModified(value) {
		this.setState({ modified: value });
	}

	handleClick() {
		this.uploadAndEdit.current.getImageFromUploaderAndEditor(file => this.handlePostStory(file));
	}

	handleChangeTime(event) {
		event.persist();

		const duration = this.hours.current.value * 60 + this.minutes.current.value * 1;

		if (duration > 1440 || duration < 10) {
			this.handleModified(false);
			return;
		}
		this.setState({expiration: duration});
		this.handleModified(true);
	}

	assembleFormData(media) {
		const { expiration } = this.state;
		return {
			expiration,
			media,
		};
	}

	handlePostStory(file) {
		if (Date.now() - this.state.lastSent < 1000) return;
		this.setState({ lastSent: Date.now() });

		const formData = new FormData();
		const data = this.assembleFormData(file);
		Object.keys(data).forEach(key => {
			formData.append(key, data[key]);
		});
		request.send("POST", "/stories", formData, {
			"Content-Type": "multipart/form-data"
		}).then(res => res.data).then(data => {
			this.props.handleNewStory(data);
			this.props.setModal(false);
			Swal.fire({
				type: "success",
				title: "Success!",
				text: "201: Story was successfully created",
			});
		}).catch(error => this.renderError(`${error.response.status}: ${capitalize(error.response.data.text)}`));
	}

	render() {
		return <div className="uploadStory">
			<div className="photo-container">
				<UploadAndEdit ref={this.uploadAndEdit} handleModified={this.handleModified} exts={["PNG", "JPEG", "GIF", "MP4", "WMV", "FLV"]} height={384} width={216}/>
			</div>
			<div className="info-container">
				<div className="info">
					<label> Enter story expiration: <p>(min: 10M, max: 24H, default: 10M)</p></label> <br/>
					<div className="storyExpirationFields">
						<input ref={this.hours} onChange={this.handleChangeTime} type="number" min={"0"} max={"24"} className="story-expiration" step="1" placeholder={"Hours"}/>
						<input ref={this.minutes} onChange={this.handleChangeTime} type="number" min={"0"} max={"50"} className="story-expiration" step="10" placeholder={"Minutes"}/>
					</div>
					<button className="post-story-btn" disabled={!this.state.modified} onClick={this.handleClick}>Upload story</button>
				</div>
			</div>
		</div>;
	}
}

UploadStory.propTypes = {
	setModal: PropTypes.func.isRequired,
	handleNewStory: PropTypes.func.isRequired
};
