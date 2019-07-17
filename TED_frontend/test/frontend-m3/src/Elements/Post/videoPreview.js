import React, {Component} from "react";
import { NavLink } from "react-router-dom";
import DeleteButton from "../DeleteButton";
import {request} from "../../utils";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import Swal from "sweetalert2";

const mapStateToProps = state => ({ user: state.user });

class ConnectedVideoPreview extends Component {
	constructor(props) {
		super(props);
		this.handleDelete = this.handleDelete.bind(this);
		this.playOnHover = this.playOnHover.bind(this);
		this.stopOnOut = this.stopOnOut.bind(this);
	}

	handleDelete(event) {
		event.preventDefault();
		event.stopPropagation();
		Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			type: "question",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, delete it!"
		}).then((result) => {
			if (result.value) {
				const { id } = this.props.post;
				request.send("DELETE", `/post/${id}`).then(res => res.data).finally(() => {
					this.props.removePost({ id });
					Swal.fire(
						"Deleted!",
						"Your post has been deleted.",
						"success"
					);
				});
			}
		});
	}

	playOnHover(event)
	{
		event.target.play();
		event.target.playbackRate = 2;
	}

	stopOnOut(event)
	{
		event.target.pause();
		event.target.playbackRate = event.target.defaultPlaybackRate;
		event.target.currentTime = 0;
	}

	render() {
		const { post, displayUser, user } = this.props;
		const { nLikes, nComments } = post;
		const isFromUser = user.userName === displayUser.userName;
		return (
			<NavLink className="no-style" to={`/profile/${displayUser.userName}/post/${post.id}`}>
				<div className='post'>
					<i className="fas fa-video"></i>
					<div className='preview'>
						<div className='likes'><i className="fas fa-heart"/><span>{nLikes}</span></div>
						<div className='replies'><i className="fas fa-comment"/><span>{nComments}</span></div>
					</div>
					<video loop muted onMouseOver={this.playOnHover} onMouseOut={this.stopOnOut}>
						<source src={post.getMediaPath} />
					</video>
					{isFromUser && <DeleteButton handleDelete={this.handleDelete}/>}
				</div>
			</NavLink>);

	}
}

ConnectedVideoPreview.propTypes = {
	post: PropTypes.shape({
		id: PropTypes.number
	}),
	removePost: PropTypes.func.isRequired,
	displayUser: PropTypes.object,
	user: PropTypes.object
};

const PostPreview = connect(mapStateToProps)(ConnectedVideoPreview);

export default PostPreview;
