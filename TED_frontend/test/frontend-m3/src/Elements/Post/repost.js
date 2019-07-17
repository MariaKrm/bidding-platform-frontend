import React, { Component } from "react";
// import { request } from "../../utils";
// import Swal from "sweetalert2";
import PropTypes from "prop-types";
import Modal from "../Modal";
import ReactDOM from "react-dom";
import NewMedia from "../../NewMedia";
import {reloadPosts} from "../../Redux/actions";
import { connect } from "react-redux";

const mapStateToProps = state => ({ user: state.user });
const mapDispatchToProps = dispatch => ({
	shouldReloadPosts: should => dispatch(reloadPosts(should))
});

class RepostButton extends Component {
	constructor(props){
		super(props);
		
		this.state = {
			open: false
		};
		
		this.handleClick = this.handleClick.bind(this);
		this.handleNewPost = this.handleNewPost.bind(this);
		this.setModal = this.setModal.bind(this);
	}
	
	setModal(open) {
		this.setState({ open });
	}
	
	handleNewPost() {
		const isProfilePage = window.location.pathname.split("/profile/").length > 1;
		if (!isProfilePage) return;
		const userName = window.location.pathname.split("/")[2];
		if (userName !== this.props.user.userName) return;
		this.props.shouldReloadPosts(true);
	}

	handleClick() {
		this.setModal(true);
		// Swal.fire({
		// 	title: "Are you sure?",
		// 	text: "You will repost this as your own post!",
		// 	type: "warning",
		// 	showCancelButton: true,
		// 	confirmButtonColor: "#2d82ec",
		// 	cancelButtonColor: "#d82b2b",
		// 	confirmButtonText: "Yes, repost this!"
		// }).then((result) => {
		// 	if (result.value) {
		// 		request.send("POST", "/post/"+this.props.post.id, {
		// 			title: this.props.post.title,
		// 			caption: this.props.post.caption
		// 		}).then(res => res.data).then(() => Swal.fire(
		// 			"Reposted!",
		// 			"This post has successfully been reposted!",
		// 			"success"
		// 		)).catch(err => console.error(err.response));
		// 	}
		// });
	}
	
	renderModal() {
		return ReactDOM.createPortal(
			<Modal setModal={this.setModal} modalClasses={["newMedia", "repostMedia"]} contentClasses={[]}>
				<NewMedia
					setModal={this.setModal}
					handleNewPost={this.handleNewPost}
					post={this.props.post}
				/>
			</Modal>,
			document.body
		);
	}
	
	render() {
		return <div className="repost-stat">
			<button className="repost-btn" onClick = {this.handleClick}>
				<i className="fas fa-retweet"/>
				<span>Repost</span>
			</button>
			{this.state.open && this.renderModal()}
		</div>;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(RepostButton);

RepostButton.propTypes = {
	post: PropTypes.shape({
		id: PropTypes.number,
		title: PropTypes.string,
		caption: PropTypes.string
	}).isRequired,
	user: PropTypes.shape({
		userName: PropTypes.string
	}).isRequired,
	shouldReloadPosts: PropTypes.func.isRequired
};
