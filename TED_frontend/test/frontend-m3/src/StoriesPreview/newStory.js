import React, {Component, Fragment} from "react";
import Modal from "react-bootstrap/Modal";
import UploadStory from "./uploadStory";
import PropTypes from "prop-types";

export default class NewStory extends Component {
	constructor(props) {
		super(props);

		this.state = {
			show: false
		};

		this.handleShowModal = this.handleShowModal.bind(this);
	}

	handleShowModal(show) {
		this.setState({show});
	}

	render() {
		return <Fragment>
			<div className="newStory-container">
				<div className="newStory" onClick={() => this.handleShowModal(true)}>
					<i className="fas fa-plus"/>
				</div>
			</div>

			<Modal className="storiesModal-upload" show={this.state.show} onHide={() => this.handleShowModal(false)} centered>
				<Modal.Header>
					<Modal.Title> New Story </Modal.Title>
				</Modal.Header>
				<Modal.Body> <UploadStory setModal={this.handleShowModal} handleNewStory={this.props.addStory} /> </Modal.Body>
			</Modal>
		</Fragment>;
	}
}

NewStory.propTypes = {
	addStory: PropTypes.func.isRequired
};
