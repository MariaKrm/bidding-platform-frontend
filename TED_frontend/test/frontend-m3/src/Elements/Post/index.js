import React, { Component, Fragment } from "react";
import PostInfo from "./info";
import PostInput from "./input";
import Modal from "../Modal";
import PostComments from "./comments";
import PostCommentsModal from "./modal";
import PostPicture from "./picture";
import RepostPicture from "./repicture";
import {capitalize, request} from "../../utils";
import { connect } from "react-redux";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Swal from "sweetalert2";


const mapStateToProps = (state) => ({ user: state.user });

class ConnectedPost extends Component {
	constructor(props) {
		super(props);

		this.state = {
			post: null,
			isLiked: false,
			modalOpen: false,
			comments: []
		};

		this.toggleLike = this.toggleLike.bind(this);
		this.changePost = this.changePost.bind(this);
		this.setModal = this.setModal.bind(this);
		this.handleCommentClick = this.handleCommentClick.bind(this);
		this.handleCommentDelete = this.handleCommentDelete.bind(this);
		this.handleNewComment = this.handleNewComment.bind(this);
		this.renderModal = this.renderModal.bind(this);
	}

	componentDidMount() {
		this.loadPost();
	}
	
	UNSAFE_componentWillReceiveProps(nextProps) {
		request.send("GET", `/post/${nextProps.post}`).then(res => res.data).then(post => {
			this.setState({
				post: post,
				isLiked: post.liked,
				comments: post.comments
			});
		});
	}
	
	loadPost() {
		request.send("GET", `/post/${this.props.post}`).then(res => res.data).then(post => {
			this.setState({
				post,
				isLiked: post.liked,
				comments: post.comments
			});
		}).catch(err => {
			// if (!err.response) return console.error(err);
			Swal.fire({
				type: "error",
				title: `${err.response.status}: ${err.response.statusText}`,
				text: "There was an issue with your request",
				timer: 2500
			}).then(() => {
				this.props.history.goBack();
			});
		});
	}

	toggleLike(removeLike) {
		const method = removeLike ? "DELETE" : "POST";
		request.send(method, `/post/${this.state.post.id}/like`).then(() => {
			this.loadPost();
		}).catch(err => this.renderError(`${err.response.status}: ${capitalize(err.response.data.text).slice(0, -1)} this post.`));
	}

	changePost(id) {
		request.send("GET", `/post/${id}`).then(res => res.data).then(post => {
			this.setState({ post });
		});
	}

	handleCommentClick(event) {
		event.preventDefault();
		this.setModal(true);
	}

	setModal(open) {
		this.setState({ modalOpen: open });
	}

	renderModal() {
		return ReactDOM.createPortal(
			<Modal setModal={this.setModal} modalClasses={["post"]} contentClasses={["comments"]}>
				<div className={"header"}>Comments</div>
				<PostCommentsModal
					post={this.state.post}
					setModal={this.setModal}
					commentsToShow={this.props.minComments}
				/>
			</Modal>,
			document.body
		);
	}

	handleCommentDelete() {
		this.loadPost();
	}

	handleNewComment() {
		this.loadPost();
	}
	
	renderError(text) {
		Swal.fire({
			type: "error",
			title: "Oops...",
			text,
		});
	}

	render() {
		const { post, isLiked } = this.state;
		if (!post || !post.user) return null;
		const isOwnPost = post.user.userName === this.props.user.userName;
		const isRepost = post.innerPost !== null;
		const { advertisement } = post;
		return (
			<div className={["post", isRepost ? "repost-container" : null, advertisement ? "ad" : null].filter(x => x).join(" ")}>
				{isRepost? <RepostPicture post={post}>
					<PostPicture
						isModal={this.props.isModal}
						post={post}
						changePost={this.changePost}
						toggleLike={this.toggleLike}
						isLiked={isLiked}
						posts={this.props.posts}
					/>
				</RepostPicture> : <PostPicture
					isModal={this.props.isModal}
					post={post}
					changePost={this.changePost}
					toggleLike={this.toggleLike}
					isLiked={isLiked}
					posts={this.props.posts}
				/>}
				<Fragment>
					<PostInfo
						post={post}
						isOwnPost={isOwnPost}
						toggleLike={this.toggleLike}
						isLiked={isLiked}
						commentClick={this.handleCommentClick}
					/>
					{!advertisement && <Fragment>
						{
							this.state.comments.length > 0 && <PostComments
								post={post}
								comments={this.state.comments}
								commentsToShow={this.props.minComments}
								handleCommentDelete={this.handleCommentDelete}
							/>
						}
						<PostInput
							post={post}
							handleNewComment={this.handleNewComment}
							showAllComments={this.handleCommentClick}
						/>
					</Fragment>}
				</Fragment>
				{this.state.modalOpen && this.renderModal()}
			</div>

		);}
}

ConnectedPost.propTypes = {
	user: PropTypes.shape({
		userName: PropTypes.string
	}).isRequired,
	isModal: PropTypes.bool,
	minComments: PropTypes.number,
	post: PropTypes.number.isRequired,
	posts: PropTypes.arrayOf(PropTypes.object),
	history: PropTypes.object.isRequired
};

const Post = connect(mapStateToProps)(ConnectedPost);

export default Post;
