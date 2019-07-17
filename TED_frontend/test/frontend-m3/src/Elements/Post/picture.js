import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import PropTypes from "prop-types";

const mapStateToProps = (state) => ({ user: state.user });

class NavigationArrow extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			isRedirecting: false,
		};
  
		this.handleClick = this.handleClick.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
	}
	
	handleClick(event) {
		event.preventDefault();
		this.props.changePost(this.props.targetPost);
		this.setState({ isRedirecting: true });
	}
	
	handleKeyDown(event) {
		if (this.props.isPrev && event.keyCode === 37) return this.handleClick(event);
		if (!this.props.isPrev && event.keyCode === 39) return this.handleClick(event);
	}
	
	componentDidUpdate() {
		if (this.state.isRedirecting) {
			this.setState({ isRedirecting: false });
		}
	}
	
	componentDidMount() {
		document.body.addEventListener("keyup", this.handleKeyDown);
	}
	
	componentWillUnmount() {
		document.body.removeEventListener("keyup", this.handleKeyDown);
	}
	
	render() {
		const url = `/profile/${this.props.user}/post/${this.props.targetPost}`;
		return <NavLink
			className="no-style"
			to={url}
			onClick={this.handleClick}
		>
			{this.state.isRedirecting && <Redirect to={url}/>}
			{this.props.children}
		</NavLink>;
	}
}

NavigationArrow.propTypes = {
	changePost: PropTypes.func.isRequired,
	targetPost: PropTypes.number.isRequired,
	isPrev: PropTypes.bool,
	user: PropTypes.string.isRequired,
	children: PropTypes.element
};

class ConnectedPostPicture extends Component {
	constructor(props) {
		super(props);

		this.handleDoubleClick = this.handleDoubleClick.bind(this);
		
		this.state = {
			likeAnimPlaying: false,
			posts: props.posts,
		};
	}
	
	UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState({
			posts: nextProps.posts
		});
	}

	renderArrows() {
		if (!this.props.isModal || this.state.posts.length < 2) return [null, null];
		const userName = window.location.pathname.split("/")[2];
		const idx = this.state.posts.findIndex(post => post.id === this.props.post.id);
  
		const prevIdx = (idx - 1 < 0) ? this.state.posts.length - 1 : idx - 1;
		const nextIdx = (idx + 1 >= this.state.posts.length) ? 0 : idx + 1;
  
		const prevId = this.state.posts[prevIdx].id;
		const nextId = this.state.posts[nextIdx].id;
		
		return [
			<NavigationArrow
				key={1}
				user={userName}
				targetPost={prevId}
				isPrev={true}
				changePost={this.props.changePost}>
				<i className="fas fa-chevron-left"/>
			</NavigationArrow>,
			<NavigationArrow
				key={2}
				user={userName}
				targetPost={nextId}
				isPrev={false}
				changePost={this.props.changePost}>
				<i className="fas fa-chevron-right"/>
			</NavigationArrow>
		];
	}
	
	handleDoubleClick() {
		const isOwnPost = this.props.post.user.userName === this.props.user.userName;
		if (this.props.isLiked || this.state.likeAnimPlaying || isOwnPost) return;
		this.setState({ likeAnimPlaying: true });
		setTimeout(() => this.setState({ likeAnimPlaying: false }), 1100);
		this.props.toggleLike();
	}
	
	render() {
		const [ leftArrow, rightArrow ] = this.renderArrows();
		const isOwnPost = this.props.post.user.userName === this.props.user.userName;
		const disabledClass = (isOwnPost || this.props.isLiked) ? "disabled" : "";
		const exts = ["jpeg", "jpg", "png", "gif"];
		const isImage = exts.includes(this.props.post.getMediaPath.split(".").pop());
		return 	<div className={"picture "+ (isImage && disabledClass)} onDoubleClick={this.handleDoubleClick}>
			<div className={"container"}>
				{leftArrow}
				{isImage ?
					<React.Fragment>
						<img src={this.props.post.getMediaPath} alt={"post's content"}/>
						<img className='blur-bg' src={this.props.post.getMediaPath} alt={"post's blurry background "}/>
					</React.Fragment>
					:
					<React.Fragment>
						<video autoPlay={this.props.isModal} controls loop>
							<source src={this.props.post.getMediaPath} />
						</video>
					</React.Fragment>
				}
				{this.props.post.advertisement && <span className={"ad-watermark"}><i className="fas fa-ad"/></span>}
				{rightArrow}
			</div>
			{this.state.likeAnimPlaying && <div className={"like-anim"}><i className="fas fa-heart"/></div>}
		</div>;
	}
}

ConnectedPostPicture.propTypes = {
	isModal: PropTypes.bool,
	post: PropTypes.shape({
		id: PropTypes.number,
		getMediaPath: PropTypes.string,
		user: PropTypes.shape({
			userName: PropTypes.string
		}),
		advertisement: PropTypes.bool
	}),
	posts: PropTypes.arrayOf(PropTypes.object),
	changePost: PropTypes.func,
	user: PropTypes.shape({
		userName: PropTypes.string
	}),
	isLiked: PropTypes.bool,
	toggleLike: PropTypes.func.isRequired,
	
};


const PostPicture = connect(mapStateToProps)(ConnectedPostPicture);

export default PostPicture;
