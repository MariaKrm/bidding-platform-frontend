import React, { Component } from "react";
import PropTypes from "prop-types";


export default class Modal extends Component {
	constructor(props) {
		super(props);
		this.modalContent = React.createRef();
		this.modal = React.createRef();
		
		this.handleClick = this.handleClick.bind(this);
	}
	
	handleClick(event) {
		event.stopPropagation();
		const { current: content } = this.modalContent;
		if (!content.contains(event.target)) {
			const { current: modal } = this.modal;
			modal.classList.remove("show");
			setTimeout(() => this.props.setModal(false), 500);
		}
	}
 
	componentDidMount() {
		document.body.style.overflowY = "hidden";
	}
 
	componentWillUnmount() {
		const modalsCount = document.querySelectorAll(".modal").length;
		if (modalsCount < 2) document.body.style.overflowY = "auto";
	}
	
	render() {
		return <aside
			ref={this.modal}
			className={`modal show ${this.props.modalClasses ? this.props.modalClasses.join(" ") : ""}`}
			onClick={this.handleClick}
		>
			<div
				ref={this.modalContent}
				className={`content ${this.props.contentClasses ? this.props.contentClasses.join(" ") : ""}`}
			>
				{this.props.children}
			</div>
		</aside>;
	}
}

Modal.propTypes = {
	children: PropTypes.element,
	modalClasses: PropTypes.arrayOf(PropTypes.string),
	contentClasses: PropTypes.arrayOf(PropTypes.string),
	setModal: PropTypes.func.isRequired
};
