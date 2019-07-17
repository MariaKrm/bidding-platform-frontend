import React, { Component, Fragment } from "react";
import { Redirect } from "react-router";
import PropTypes from "prop-types";

export default class ProfileModal extends Component {
	constructor(props) {
		super(props);

		this.modal = React.createRef();
		this.modalContent = React.createRef();
		this.state = {
			isClosing: false
		};

		this.handleModalClick = this.handleModalClick.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	closeModal(event) {
		if (event) event.preventDefault();
		const { current: modal } = this.modal;
		modal.classList.remove("show");
		setTimeout(() => this.setState({ isClosing: true }), 500);
	}

	handleModalClick(event) {
		event.stopPropagation();
		const { current: content } = this.modalContent;
		if (!content.contains(event.target)) {
			this.closeModal();
		}
	}

	handleKeyUp(event) {
		if (event.keyCode === 27) {
			this.setState({ isClosing: true });
		}
	}

	componentDidMount() {
		document.body.style.overflowY = "hidden";
		document.body.addEventListener("keyup", this.handleKeyUp);
	}

	componentWillUnmount() {
		document.body.style.overflowY = "auto";
		document.body.removeEventListener("keyup", this.handleKeyUp);
		this.props.reloadData();
	}

	render() {
		const { isClosing } = this.state;
		return <Fragment>
			{isClosing && <Redirect to={`/profile/${this.props.username}`}/>}
			<aside ref={this.modal} className="modal show" onClick={this.handleModalClick}>
				<div ref={this.modalContent} className="content modal-post">
					<a href={"/"} onClick={this.closeModal} className="x-icon"><i className="fas fa-times"/></a>
					{this.props.children}
				</div>
			</aside>
		</Fragment>;

	}
}

ProfileModal.propTypes = {
	reloadData : PropTypes.func.isRequired,
	username : PropTypes.string,
	children : PropTypes.element
};
