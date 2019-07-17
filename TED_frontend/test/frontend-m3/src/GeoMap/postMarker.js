import React, {Component, Fragment} from "react";
import ReactDOM from "react-dom";
import Modal from "../Elements/Modal";
import Post from "../Elements/Post";
import PropTypes from "prop-types";

export default class PostMarker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalShow: false
		};
		this.handleClick = this.handleClick.bind(this);
		this.setModal = this.setModal.bind(this);
	}
	
	setModal(open) {
		this.setState({ modalShow: open });
	}
	
	handleClick() {
		this.setModal(true);
	}
	
	renderModal() {
		return ReactDOM.createPortal(<Modal setModal={this.setModal}>
			<Post post={this.props.postId} minComments={10}/>
		</Modal>,
		document.body);
	}
	
	render() {
		return <Fragment>
			<div className={"post-marker"} onClick={this.handleClick}/>
			{this.state.modalShow && this.renderModal()}
		</Fragment>;
	}
}

PostMarker.propTypes = {
	postId: PropTypes.number.isRequired
};
