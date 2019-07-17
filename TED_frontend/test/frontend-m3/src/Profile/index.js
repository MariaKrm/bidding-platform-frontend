import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import ProfileInfo from "./info.js";
import ProfileModal from "./modal.js";
import { Redirect } from "react-router";
import { Route, Switch } from "react-router-dom";
import Settings from "../Settings";
import {assignUser, reloadPosts} from "../Redux/actions";
import PostPreview from "../Elements/Post/preview.js";
import VideoPreview from "../Elements/Post/videoPreview.js";
import { request } from "../utils";
import ReactDOM from "react-dom";
import Post from "../Elements/Post";
import Private from "../Elements/Private";
import ProfileNotFound from "./notfound";
import PropTypes from "prop-types";

const mapStateToProps = (state) => ({
	user: state.user,
	userFollowing: state.userFollowing,
	shouldReload: state.shouldReloadPosts
});

const mapDispatchToProps = (dispatch) => ({
	assignUser: user => dispatch(assignUser(user)),
	shouldReloadPosts: should => dispatch(reloadPosts(should))
});

function ProfileContent (props) {
	return (<Fragment>
		<ProfileInfo displayUser={props.displayUser} reloadData={props.reloadData}/>
		<div className='posts'>
			<div className='container'>
				{props.children}
			</div>
		</div>
	</Fragment>);
}

ProfileContent.propTypes = {
	displayUser : PropTypes.object,
	reloadData : PropTypes.func,
	children : PropTypes.array
};


class ConnectedProfile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			displayUser: null,
			posts: [],
			notFound: false
		};
		this.reloadData = this.reloadData.bind(this);
		this.removePost = this.removePost.bind(this);
	}

	loadUser() {
		const { username } = this.props.match.params;
		return request.send("GET", `/user/${username}`).then(res => res.data).then(user => {
			if (user.userName === this.props.user.userName) {
				this.props.assignUser(user);
			}
			return user;
		});
	}

	removePost(post) {
		this.setState(state => ({
			posts: state.posts.filter(x => x.id !== post.id)
		}));
		if (post.getMediaPath === this.props.user.imgPath) {
			this.reloadData();
		}
	}

	reloadData() {
		this.loadUser().then(user => {
			this.setState({ displayUser: user, posts: user.posts });
			if (user.userName !== this.props.user.userName) return;
			this.props.shouldReloadPosts(false);
		}).catch(() => {
			this.setState({ notFound: true });
		});
	}

	componentDidMount() {
		this.reloadData();
	}
	
	UNSAFE_componentWillReceiveProps(nextProps) {
		const { username } = nextProps.match.params;
		if (this.state.displayUser && username === this.state.displayUser.userName) return;
		return request.send("GET", `/user/${username}`).then(res => res.data).then(user => {
			if (user.userName === nextProps.user.userName) {
				nextProps.assignUser(user);
			}
			return user;
		}).then(user => {
			this.setState({ displayUser: user, posts: user.posts });
			if (user.userName !== nextProps.user.userName) return;
			nextProps.shouldReloadPosts(false);
		});
	}
	
	renderPosts() {
		const { displayUser, posts } = this.state;
		
		if (!displayUser) return null;
		if (posts.length === 0) {
			return <p>There are no posts to display</p>;
		}
		posts.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
		
		return posts.map(post => {
			const ext = post.getMediaPath.split(".").pop();
			
			if (["jpeg", "jpg", "png", "gif"].includes(ext)) {
				return <PostPreview
					key={post.id}
					displayUser={displayUser}
					post={post}
					removePost={this.removePost}
				/>;
			}
			if (["wmv", "mp4", "flv"].includes(ext)) {
				return <VideoPreview
					key={post.id}
					displayUser={displayUser}
					post={post}
					removePost={this.removePost}
				/>;
			}
			return null;
		});
		
	}

	renderModal(props) {
		const { postId, username } = props.match.params;
		return ReactDOM.createPortal(
			<ProfileModal username={username} reloadData={this.reloadData}>
				<Post history={props.history} isModal={true} post={parseInt(postId)} minComments={10} posts={this.state.posts}/>
			</ProfileModal>,
			document.body
		);
	}

	render() {
		const { username } = this.props.match.params;
		const { user: loggedUser } = this.props;
		const { displayUser } = this.state;
		if (!displayUser || displayUser.userName !== username || this.props.shouldReload) {
			if (this.state.notFound) return <ProfileNotFound/>;
			this.reloadData();
			if (!displayUser) {
				return null;
			}
		}

		const isOwnProfile = displayUser.userName === loggedUser.userName;

		const isPrivate = displayUser.privateProfile;
		const followingDisplayUser = displayUser.followed;
		return <div className='profile'>
			{!this.state.displayUser && <Redirect to='/'/>}
			<Switch>
				<Route path="/profile/:username" render={() => (
					<ProfileContent displayUser={this.state.displayUser} reloadData={this.reloadData}>
						{(isPrivate && !isOwnProfile && !followingDisplayUser) ? (<Private/>) : (this.renderPosts())}
						<Route path="/profile/:username/post/:postId" render={(props) => this.renderModal(props)}/>
					</ProfileContent>
				)}/>
				{isOwnProfile && <Route path='/settings' render={() => (
					<Settings displayUser={this.state.displayUser}/>
				)}/>}
			</Switch>
		</div>;
	}
}


const Profile = connect(mapStateToProps, mapDispatchToProps)(ConnectedProfile);

export default Profile;

ConnectedProfile.propTypes = {
	match : PropTypes.shape({
		params : PropTypes.shape({
			username : PropTypes.string
		})
	}),
	assignUser : PropTypes.func.isRequired,
	user : PropTypes.shape({
		imgPath : PropTypes.string,
		userName : PropTypes.string
	}),
	shouldReload : PropTypes.bool,
	shouldReloadPosts : PropTypes.func.isRequired
};
