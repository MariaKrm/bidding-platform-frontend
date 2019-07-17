import React, {Component, Fragment} from "react";
// import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PostPreview from "../Elements/Post/preview.js";
import VideoPreview from "../Elements/Post/videoPreview.js";
import { request } from "../utils";

const mapStateToProps = state => ({ user: state.user });


class ConnectedTopPosts extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mostLiked: [],
			mostCommented: []
		};
	}
	
	componentDidMount() {
		this.loadPosts();
	}
	
	loadPosts() {
		request.send("GET", "/statistics/user").then(res => res.data).then(data => {
			this.setState({ mostLiked: data.mostLikedPost, mostCommented: data.mostCommentPost});
		});
	}
	
	renderPostsCommented() {
		const { mostCommented } = this.state;
		if (mostCommented.length === 0) {
			return <p>There are no posts to display</p>;
		}
		return mostCommented.map(post => {
			const ext = post.getMediaPath.split(".").pop();
			if (["jpeg", "jpg", "png", "gif"].includes(ext)) {
				return <PostPreview
					key={post.id}
					displayUser={this.props.user}
					post={post}
				/>;
			} else if (["mp4", "flv", "wmv"].includes(ext)) {
				return <VideoPreview
					key={post.id}
					displayUser={this.props.user}
					post={post}
				/>;
			}
			return null;
		});
	}
	
	renderPostsLiked() {
		const { mostLiked } = this.state;
		if (mostLiked.length === 0) {
			return <p>There are no posts to display</p>;
		}
		return mostLiked.map(post => {
			const ext = post.getMediaPath.split(".").pop();
			if (["jpeg", "jpg", "png", "gif"].includes(ext)) {
				return <PostPreview
					key={post.id}
					displayUser={this.props.user}
					post={post}
				/>;
			} else if (["mp4", "flv", "wmv"].includes(ext)) {
				return <VideoPreview
					key={post.id}
					displayUser={this.props.user}
					post={post}
				/>;
			}
			return null;
		});
	}

	render(){
		return <Fragment>
			<div className="top">
				<div className={"top-container"}>
					<h4>3 Most commented posts</h4>
					<div className="top-commented">
						{this.renderPostsCommented()}
					</div>
					<h4>3 Most liked posts</h4>
					<div className="top-liked">
						{this.renderPostsLiked()}
					</div>
				</div>
			</div>
		</Fragment>;
		
	}
}

ConnectedTopPosts.propTypes = {
	user: PropTypes.object
};

const TopPosts = connect(mapStateToProps)(ConnectedTopPosts);

export default TopPosts;
