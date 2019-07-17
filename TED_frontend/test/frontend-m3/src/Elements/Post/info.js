import React, {Component} from "react";
import ReactDOM from "react-dom";
import { NavLink } from "react-router-dom";
import Timestamp from "../Timestamp";
import LikeList from "./liked";
import Modal from "../Modal";
import PostStatistics from "./stats";
import Caption from "../Caption";
import PostLocation from "./location";
import PropTypes from "prop-types";
import RepostButton from "./repost";

export default class PostInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalOpen: false,
		};

		this.setModal = this.setModal.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	setModal(open) {
		this.setState({ modalOpen: open});
	}

	handleClick(event) {
		event.preventDefault();
		if (this.props.post.nLikes === 0) return;
		return this.setModal(true);
	}


	renderModal() {
		return ReactDOM.createPortal(
			<Modal setModal={this.setModal} modalClasses={[]} contentClasses={["likes"]}>
				<LikeList postId={this.props.post.id} setModal={this.setModal}/>
			</Modal>,
			document.body
		);
	}
	
	parseLink(link) {
		const regex = /^((http)|(https)):\/\/.*/gi;
		if (regex.test(link)) return link;
		return `http://${link}`;
	}

	render() {
		const { post } = this.props;
		const { createdAt, title, user, advertisement, link } = post;
		const imgPath = user.imgPath || process.env.PUBLIC_URL+"/images/profile-placeholder.png";
		const repostable = !user.privateProfile;
		return <div className="info">
			<div className="info-top">
				<div className="author">
					<img className="avatar" src={imgPath} alt={`${user.userName}'s avatar`}/>
					<div>
						<NavLink to={`/profile/${user.userName}`}><span className="full-name">{user.userName}</span></NavLink>
						<Timestamp since={createdAt}/>
					</div>
				</div>
				{!advertisement ? <div>
					<a href={"/"} onClick={this.props.commentClick} className="open-allComments">
						<p>All Comments </p>
						<span>({post.nComments})</span>
					</a>
				</div> : <div>
					<a href={this.parseLink(link)} target="_blank" rel="noopener noreferrer">{link}</a>
				</div>}
				<PostLocation postId={post.id} location={post.location} isOwnPost={this.props.isOwnPost}/>
				{repostable && !advertisement && <RepostButton post={post}/>}
				<PostStatistics
					isLiked={this.props.isLiked}
					toggleLike={this.props.toggleLike}
					onClick={this.handleClick}
					nLikes={post.nLikes}
					location={post.location}
				/>
			</div>
			{
				title && title !== "" && (!post.caption || post.caption === "") &&
				<div className="info-bottom">
					{title && title !== "" && <div className="title">{title}</div>}
				</div>
			}
			{
				title && title !== "" && post.caption && post.caption !== "" &&
				<div className="info-bottom">
					{title && title !== "" && <div className="title">{title}</div>}
					{title && post.caption !== "" && <Caption content={post.caption}/>}
				</div>
			}
			{this.state.modalOpen && this.renderModal()}
		</div>;
	}
}

PostInfo.propTypes = {
	post: PropTypes.object,
	commentClick: PropTypes.func,
	isLiked: PropTypes.bool,
	toggleLike: PropTypes.func,
	isOwnPost: PropTypes.bool.isRequired
};
