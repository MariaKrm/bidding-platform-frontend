import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";
import TimeAgo from "react-timeago";
import { connect } from "react-redux";
import {NavLink} from "react-router-dom";
import { request } from "../../utils";

const mapStateToProps = state => ({
	user: state.user
});

class Message extends Component {
	constructor(props) {
		super(props);
		this.state = {
			urls: {},
			posts: {}
		};
	}
	
	renderInline(part) {
		const { content } = part.payload;
		const regEx = /http:\/\/localhost:3000\/profile\/\w{6,}\/post\/[0-9]+/gm;
		content.replace(regEx, matched => `~${matched}~`);
		return content.split("~").map((element, i) => {
			if (regEx.test(element)) {
				const postId = element.split("/").pop();
				if (this.state.posts[postId]) {
					if (!this.state.posts[postId].getMediaPath) return <span key={i}>{element}</span>;
					const exts = ["jpeg", "jpg", "png", "gif"];
					const isImage = exts.includes(this.state.posts[postId].getMediaPath.split(".").pop());
					return <NavLink key={i} to={"/"+element.split("/").slice(3).join("/")}>
						{element}
						<div className={"chat-post"}>
							<div className={"chat-media"}>
								{isImage ? <Fragment>
									<img alt={"post-background"} className={"background"} src={this.state.posts[postId].getMediaPath}/>
									<img alt={"post-preview"} src={this.state.posts[postId].getMediaPath}/>
								</Fragment> : <Fragment>
									<video controls loop>
										<source src={this.state.posts[postId].getMediaPath}/>
									</video>
								</Fragment>}
							</div>
							<div className={"stats"}>
								<div className={"likes"}>
									<i className="fas fa-heart"/>
									{this.state.posts[postId].nLikes}
								</div>
								<div className={"comments"}>
									<i className="fas fa-comment"/>
									{this.state.posts[postId].nComments}
								</div>
								<div className={"post-author"}>
									By {this.state.posts[postId].user.userName}
								</div>
							</div>
						</div>
					</NavLink>;
				}
				if (!this.state.posts[postId] || !this.state.post[postId].getMediaPath) {
					this.setState(state => ({
						posts: Object.assign(state.posts, { [postId]: {} })
					}));
					request.send("GET", "/post/"+postId).then(res => res.data).then(post => this.setState(state => ({
						posts: Object.assign(state.posts, { [post.id]: post })
					}))).catch(() => this.setState(state => (
						{ posts: Object.assign(state.posts, { [postId]: {} })}
					)));
					return null;
				}
			}
			return <span key={i}>{element}</span>;
		});
	}
	
	renderParts(id, parts) {
		return parts.map(part => {
			if (part.partType === "inline") {
				return this.renderInline(part);
			} else if (part.partType === "attachment") {
				const videoMIME = ["video/mp4", "video/x-flv", "video/3gpp", "video/x-ms-wmv"];
				if (this.state.urls[id]) {
					return <div className={"chat-media"}>{videoMIME.includes(part.payload.type) ? <video controls loop>
						<source src={this.state.urls[id]}/>
					</video> : <a target="_blank" rel="noopener noreferrer" href={this.state.urls[id]}>
						<img alt={"message content media"} src={this.state.urls[id]}/>
					</a>}</div>;
				}
				part.payload.url().then(url => this.setState(state => (
					{
						urls: Object.assign(state.urls, { [id]: url })
					}
				)));
			}
			return null;
		});
	}
	
	render() {
		const classes = ["message"];
		const imgPath = this.props.userTarget.imgPath || process.env.PUBLIC_URL+"/images/profile-placeholder.png";
		if (this.props.index === 0) classes.push("first");
		if (this.props.index === this.props.length - 1) classes.push("last");
		return (
			<li className={classes.join(" ")}>
				{this.props.index === 0 && <div className={"author"}>
					{ !this.props.isOwnSequence && <Fragment>
						<NavLink to={`/profile/${this.props.userTarget.userName}`}><img src={imgPath} alt={`${this.props.userTarget.userName}'s avatar`}/></NavLink>
					</Fragment>}
				</div>}
				<div className={"bubble"}>
					{this.renderParts(this.props.message.id, this.props.message.parts)}
				</div>
				{this.props.index === this.props.length - 1 && <div className={"timestamp"}>
					<TimeAgo date={this.props.message.createdAt}/>
				</div>}
			</li>
		);
	}
}

Message.propTypes = {
	userTarget: PropTypes.shape({
		imgPath: PropTypes.string,
		userName: PropTypes.string
	}).isRequired,
	length: PropTypes.number.isRequired,
	message: PropTypes.object.isRequired,
	isOwnSequence: PropTypes.bool.isRequired,
	index: PropTypes.number.isRequired
};
class MessageList extends Component {
	constructor(props) {
		super(props);
	}
	
	renderMessages() {
		return this.props.messages.map((sequence, i) => {
			const isOwnSequence = sequence[0].senderId === this.props.user.userName;
			if (i === this.props.messages.length - 1) {
				this.props.currentUser.setReadCursor({
					roomId: this.props.room.id,
					position: sequence[sequence.length - 1].id
				});
			}
			return <div key={i} className={["sequence", isOwnSequence ? "own" : null].join(" ")}>
				{sequence.map((message, j) => <Message
					key={message.id}
					isOwnSequence={isOwnSequence}
					message={message}
					index={j}
					length={sequence.length}
					userTarget={this.props.userTarget}
				/>)}
			</div>;

		});
	}
	
	render() {
		return (
			<Fragment>
				<ul ref={this.props.forwardRef} className="message-list">
					{this.renderMessages()}
					{this.props.userTyping && <span className={"typing-indicator"}>
						{this.props.userTarget.userName} is typing...
					</span>}
				</ul>
			</Fragment>
		);
	}
}

MessageList.propTypes = {
	messages: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
	user: PropTypes.shape({
		userName: PropTypes.string
	}).isRequired,
	userTyping: PropTypes.bool.isRequired,
	currentUser: PropTypes.object.isRequired,
	room: PropTypes.object.isRequired,
	userTarget: PropTypes.shape({
		userName: PropTypes.string,
		imgPath: PropTypes.string
	}),
	forwardRef: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(MessageList);
