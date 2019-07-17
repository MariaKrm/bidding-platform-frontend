import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Stories from "react-insta-stories";

export default class Preview extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false
		};

		this.handleShowModal = this.handleShowModal.bind(this);
		this.renderPreview = this.renderPreview.bind(this);
	}

	handleShowModal(show) {
		this.setState({show});
	}

	renderPreview() {
		const ext = this.props.story.stories[0].url.split(".").pop();
		if (["mp4", "flv", "wmv"].includes(ext)) {
			return <video className="storyPreviewBlur" src={this.props.story.stories[0].url} autoPlay muted loop/>;
		}
		return <div className="storyPreviewBlur" style={{backgroundImage: `url(${this.props.story.stories[0].url})`}}/>;
	}

	render() {
		if (this.props.story.stories.length === 0) {
			return null;
		}
		return <Fragment>
			<Modal show={this.state.show} onHide={() => this.handleShowModal(false)} id="storiesModal" centered>
				<Modal.Body>
					<Stories
						stories={this.props.story.stories}
						defaultInterval={2500}
						width={432}
						height={768}
					/>
				</Modal.Body>
			</Modal>
			<div className="storyPreview-container">
				<div className="storyPreview" onClick={() => this.handleShowModal(true)} >
					{this.renderPreview()}
					<div className="storyProfileImage" style={{backgroundImage: `url(${this.props.story.imgPath || process.env.PUBLIC_URL + "/images/profile-placeholder.png"})`}}/>
					<p>{"@" + this.props.story.user}</p>
				</div>
			</div>
		</Fragment>;
	}
}

Preview.propTypes = {
	setShowModal: PropTypes.func,
	story: PropTypes.object
};
