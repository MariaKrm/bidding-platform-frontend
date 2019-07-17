import React, { Component, Fragment } from "react";
import UploadAndEdit from "../UploadAndEdit";
import { request, capitalize } from "../utils";
import PropTypes from "prop-types";
import LocationSearch from "../Elements/LocationSearch";
import Swal from "sweetalert2";
import SelectAudience from "./SelectAudience.js";

class NewMedia extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: "",
			caption: "",
			modified: false,
			location: null,
			lastSent: Date.now(),
			whiteList: "",
			blackList: ""
		};
		
		this.isRepost = props.post !== undefined;
		
		this.title = React.createRef();
		this.caption = React.createRef();
		
		this.postButton = React.createRef();
		this.uploadAndEdit = React.createRef();

		this.handlePostPhoto = this.handlePostPhoto.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.handleModified = this.handleModified.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.setLocation = this.setLocation.bind(this);
		this.assembleFormData = this.assembleFormData.bind(this);

		this.setList = this.setList.bind(this);
	}
	
	componentDidMount() {
		if (this.isRepost) {
			const [{ current: title }, { current: caption }] = [this.title, this.caption];
			const { title: postTitle, caption: postCaption, location } = this.props.post;
			title.value = postTitle;
			caption.value = postCaption;
			this.setState({
				title: this.props.post.title,
				caption: this.props.post.caption,
				location
			});
		}
	}
	
	handleInput(event) {
		const { name: key, value } = event.target;
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
		if (this.state.location) {
			data = Object.assign(data, this.parseLocation(this.state.location));
		}
		return data;
	}

	setList(stringList, isWhiteList) {
		if (isWhiteList)
			return this.setState({whiteList : stringList});
		return this.setState({blackList : stringList});
	}

	handlePostPhoto(file) {
		if (Date.now() - this.state.lastSent < 1000) return;
		this.setState({ lastSent: Date.now() });

		const formData = new FormData();
		const data = this.assembleFormData(file);
		if (data.caption.trim() !== "" && data.title.trim() === "") return this.renderError("400: Must provide a title along with a description.");
		Object.keys(data).forEach(key => {
			formData.append(key, data[key]);
		});
		request.send("POST", "/post", formData, {
			"Content-Type": "multipart/form-data"
		}).then(res => res.data).then(() => {
			this.props.handleNewPost();
			this.props.setModal(false);
			Swal.fire({
				type: "success",
				title: "Success!",
				text: "201: Post was successfully created",
			});
		}).catch(error => this.renderError(`${error.response.status}: ${capitalize(error.response.data.text)}`));
	}
	
	handleRepostPhoto() {
		if (Date.now() - this.state.lastSent < 1000) return;
		this.setState({ lastSent: Date.now() });
		
		const formData = new FormData();
		const data = Object.assign({
			title: this.state.title,
			caption: this.state.caption
		}, this.parseLocation());
		if (data.caption.trim() !== "" && data.title.trim() === "") return this.renderError("400: Must provide a title along with a description.");
		Object.keys(data).forEach(key => {
			formData.append(key, data[key]);
		});
		request.send("POST", "/post/"+this.props.post.id, formData, {
			"Content-Type": "application/x-www-form-urlencoded"
		}).then(res => res.data).then(() => {
			this.props.handleNewPost();
			this.props.setModal(false);
			Swal.fire({
				type: "success",
				title: "Success!",
				text: "201: Post was successfully created",
			});
		}).catch(err => {
			// if (!err.response) return console.error(err.response);
			this.renderError(`${err.response.status}: ${capitalize(err.response.data.text)}`);
		});
	}

	handleClick() {
		if (this.isRepost) {
			this.handleRepostPhoto();
			return;
		}
		this.uploadAndEdit.current.getImageFromUploaderAndEditor(file => this.handlePostPhoto(file));
	}

	renderError(text) {
		Swal.fire({
			type: "error",
			title: "Oops...",
			text,
		});
	}
	
	renderMedia() {
		const { getMediaPath } = this.props.post;
		const ext = getMediaPath.split(".").pop();
		if (["jpeg", "jpg", "png", "gif"].includes(ext)) {
			return <img alt={"repost img"} src={getMediaPath}/>;
		} else if (["mp4", "flv", "wmv"].includes(ext)) {
			return <video controls loop autoPlay>
				<source src={getMediaPath}/>
			</video>;
		}
	}
	
	render() {
		return (<Fragment>
			<div className="left">
				<div className={"photo-container"}>
					{!this.isRepost ? <UploadAndEdit
						ref={this.uploadAndEdit}
						exts={["PNG", "JPEG", "GIF", "MP4", "WMV", "FLV"]}
						handleModified={this.handleModified}
						width={350}
						height={350}
					/> : <div className={"editor"}>
						<div className={"editor-not-img"}><div className={"editor-image"}>
							{this.renderMedia()}
						</div></div>
					</div>}
				</div>
			</div>
			<div className={"info-container"}>
				<div className="info">
					<div className={"title"}>
						<span>Title:</span>
						<textarea ref={this.title} placeholder="An interesting title..." name={"title"} onInput={this.handleInput}/>
					</div>
					<LocationSearch setLocation={this.setLocation} location={this.state.location}/>
					<div className={"caption"}>
						<span>Description:</span>
						<textarea ref={this.caption} placeholder="...and an amazing description!" name={"caption"} onInput={this.handleInput}/>
					</div>
					{!this.isRepost && <SelectAudience setList={this.setList}/>}
					<button className={"post-btn"} ref={this.postButton} disabled={!this.isRepost && !this.state.modified} onClick={this.handleClick}>POST</button>
				</div>
			</div>
			<div className="close-btn">
				<i className="fas fa-times-circle" onClick={this.closeModal}/>
			</div>
		</Fragment>
		);
	}

}

NewMedia.propTypes = {
	setModal: PropTypes.func.isRequired,
	handleNewPost: PropTypes.func.isRequired,
	post: PropTypes.shape({
		id: PropTypes.number,
		innerPost: PropTypes.object,
		title: PropTypes.string,
		location: PropTypes.object,
		caption: PropTypes.string,
		getMediaPath: PropTypes.string
	})
};


export default NewMedia;
