import React, { Component, Fragment } from "react";
import {NavLink} from "react-router-dom";
import UserLink from "../UserLink";
import { request } from "../../utils";
import { connect } from "react-redux";
import DeleteButton from "../DeleteButton";
import Timestamp from "../Timestamp";
import PropTypes from "prop-types";

const mapStateToProps = (state) => ({ user: state.user });

class ConnectedComment extends Component {
	constructor(props) {
		super(props);
		
		this.maxChars = 150;
		
		this.state = {
			viewAll: this.props.comment.content.length < this.maxChars,
		};

		this.handleClick = this.handleClick.bind(this);
		this.handleNavigation = this.handleNavigation.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
	}

	renderContent() {
		const { comment } = this.props;
		let content;
		if (this.state.viewAll) {
			content = comment.content;
			return content;
		}
		content = comment.content.slice(0, this.maxChars).split(" ");
		content.pop();
		content = content.join(" ");
		return <Fragment>{content}... <a href="/" onClick={this.handleClick} className="show-more">See more</a></Fragment>;
	}
	
	parseContent(content) {
		const regEx = /(#\w\w+)|(@\w{6,})/gm;
		if (!content) return content;
		content = content.replace(regEx, matched => `~${matched}~`);
		content = content.split("~").map((element, i) => {
			if (element[0] === "#") {
				element = element.slice(1);
				return <NavLink key={i} to={"/hashtag?hashtag="+element}>#{element}</NavLink>;
			}
			if (element[0] === "@") {
				if (element.length < 7) return element;
				element = element.slice(1);
				return <NavLink key={i} to={"/profile/"+element}>@{element}</NavLink>;
			}
			return element;
		});
		return content;
	}

	handleClick(event) {
		event.preventDefault();
		this.setState({ viewAll: true });
	}
	
	handleNavigation() {
		if (this.props.setModalOpen) {
			this.props.setModalOpen(false);
		}
	}
	
	handleDelete() {
		const { id } = this.props.comment;
		request.send("DELETE", `/post/${this.props.post.id}/comment/${id}`).then(() => {
			this.props.handleCommentDelete(id);
		});
	}

	render() {
		const { comment, user } = this.props;
		const { user: author, createdAt } = comment;
		const { userName } = author;
		const imgPath = author.imgPath || process.env.PUBLIC_URL+"/images/profile-placeholder.png";
		const isFromUser = author.userName === user.userName;
		return <div className="comment">
			<NavLink className="no-style profile-link" to={`/profile/${userName}`} onClick={this.handleNavigation}>
				<img className="avatar" src={imgPath} alt={`${author.userName}'s avatar`}/>
			</NavLink>
			<UserLink user={author}/>
			{this.parseContent(this.renderContent())}
			{isFromUser && this.props.comment.id && <DeleteButton handleDelete={this.handleDelete}/>}
			<Timestamp since={createdAt}/>
		</div>;
	}
}

const Comment = connect(mapStateToProps)(ConnectedComment);

ConnectedComment.propTypes = {
	comment: PropTypes.shape({
		id: PropTypes.number,
		content: PropTypes.string
	}),
	post: PropTypes.shape({
		id: PropTypes.number
	}),
	user: PropTypes.shape({
	
	}),
	setModalOpen: PropTypes.func,
	handleCommentDelete: PropTypes.func
};

export default Comment;
