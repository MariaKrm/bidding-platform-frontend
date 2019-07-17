import React, {Component} from "react";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import Post from "../Elements/Post";
import TopPosts from "../Elements/TopPosts";
import {request} from "../utils";
import PropTypes from "prop-types";
import StoriesPreview from "../StoriesPreview";
import FriendSuggestions from "../FriendSuggestions";

const mapStateToProps = (state) => ({ user: state.user });

class ConnectedFeed extends Component {
	constructor(props) {
		super(props);

		this.state = {
			posts: [],
			isUpdating: false,
			hasMore: false,
		};

		this.handleWheel = this.handleWheel.bind(this);
	}

	componentDidMount() {
		this.loadPosts();
		window.addEventListener("wheel", this.handleWheel);
	}

	componentWillUnmount() {
		window.removeEventListener("wheel", this.handleWheel);
	}

	handleWheel() {
		if (this.state.isUpdating || !this.state.hasMore) return;
		if (window.innerHeight + document.documentElement.scrollTop > document.documentElement.offsetHeight - 200) {
			this.loadOlderPosts();
		}
	}

	loadPosts() {
		request.send("GET", "/feed").then(res => res.data).then(posts => {
			this.setState({ posts, hasMore: posts.length !== 0 });
		});
	}

	loadOlderPosts() {
		const { posts, isUpdating } = this.state;
		if (posts.length === 0 || isUpdating) return;
		this.setState({ isUpdating: true });
		request.send("GET", `/feed/older/${posts[posts.length-1].id}`).then(res => res.data).then(fetched => {
			this.setState(state =>({ posts: state.posts.concat(fetched), hasMore: fetched.length !== 0}));
			setTimeout(() => { this.setState({ isUpdating: false });}, 500);
		});
	}

	renderPosts() {
		const { posts, endIndex } = this.state;
		const displayPosts = posts.slice(0, endIndex);
		return displayPosts.map((post, i) => <Post
			key={""+post.id+i}
			post={post.id}
			minComments={4}
		/>);
	}

	render() {
		if (!this.props.user) {
			return <Redirect to='/login'/>;
		}
		return <div className={"home"}>
			<StoriesPreview/>
			<TopPosts/>
			<FriendSuggestions/>
			<div className='feed'>
				<h3>Feed</h3>
				<div className="posts">
					{this.renderPosts()}
				</div>
				{!this.state.hasMore && <div className="no-more-posts">No more posts to show. Check back soon!</div>}
			</div>
		</div>;
	}
}

const Feed = connect(mapStateToProps)(ConnectedFeed);

ConnectedFeed.propTypes = {
	user: PropTypes.object
};


export default Feed;
