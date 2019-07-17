import React, { Component, Fragment } from "react";
import UserLink from "../Elements/UserLink";
import {NavLink} from "react-router-dom";
import Timestamp from "../Elements/Timestamp";
import {request} from "../utils";
import {connect} from "react-redux";
import PropTypes from "prop-types";


const mapStateToProps = state => ({
	user: state.user,
});

class ConnectedNotification extends Component {
	constructor(props) {
		super(props);
		this.renderNotification = this.renderNotification.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.props.setOpenArea(false);
	}

	renderNotification() {
		const { notification } = this.props;
		const { author, type } = notification;
		switch (type) {
		case "follow": return <Fragment>
			<UserLink user={author} onClick={this.handleClick}/> started following you
		</Fragment>;
		case "like": return <Fragment>
			<UserLink user={author} onClick={this.handleClick}/> liked your <NavLink to={`/profile/${this.props.user.userName}/post/${notification.post.id}`}>post</NavLink>
		</Fragment>;
		case "comment": return <Fragment>
			<UserLink user={author} onClick={this.handleClick}/> commented on your <NavLink to={`/profile/${this.props.user.userName}/post/${notification.post.id}`}>post</NavLink>
		</Fragment>;
		case "post": return <Fragment>
			<UserLink user={author} onClick={this.handleClick}/> submitted a new <NavLink to={`/profile/${author.userName}/post/${notification.post.id}`}>post</NavLink>
		</Fragment>;
		case "tags": return <Fragment>
			<UserLink user={author} onClick={this.handleClick}/> tagged you in this <NavLink to={`/profile/${author.userName}/post/${notification.post.id}`}>post</NavLink>
		</Fragment>;
		default: return null;
		}
	}

	render() {
		const { notification } = this.props;
		const { author, createdAt } = notification;
		const imgPath = author.imgPath || process.env.PUBLIC_URL+"/images/profile-placeholder.png";
		const newClassName = !(notification.seen) ? "new" : "";
		return <li className={"notification "+newClassName}>
			<NavLink to={`/profile/${author.userName}`}><img className={"avatar"} alt={`${author.userName}'s avatar`} src={imgPath}/></NavLink>
			<div className={"info"}>
				{this.renderNotification()}
				<Timestamp since={createdAt}/>
			</div>
		</li>;
	}
}

const Notification = connect(mapStateToProps)(ConnectedNotification);

ConnectedNotification.propTypes = {
	setOpenArea: PropTypes.func.isRequired,
	notification: PropTypes.object,
	user: PropTypes.shape({
		userName: PropTypes.string
	})
};
export default class Notifications extends Component {
	constructor(props) {
		super(props);

		this.state = {
			notifications: [],
		};

		this.handleClick = this.handleClick.bind(this);
		this.loadNotifications = this.loadNotifications.bind(this);
	}

	loadNotifications() {
		return request.send("GET", "/user/activities/notifications").then(res => res.data).then(notifications => {
			notifications.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
			this.setState({ notifications });
		});
	}

	handleClick() {
		const isActive = this.props.activeTab === this.props.idx;
		if (isActive) return this.props.setActiveTab(this.props.idx);
		this.loadNotifications().then(() => this.props.setActiveTab(this.props.idx));
	}

	renderNotifications() {
		const { notifications } = this.state;
		return notifications.map((notification, i) => {
			return <Notification notification={notification} key={i} setOpenArea={this.props.setOpenArea}/>;
		});
	}

	render() {
		const { count } = this.props;
		const isActive = this.props.activeTab === this.props.idx;
		const listClass = (isActive) ? "show" : "";
		const emptyClass = !(count > 0) ? "empty" : "";
		return <div className={"user-area-item "+listClass}>
			<div className={"header " + emptyClass} onClick={this.handleClick}>Notifications <div className={"counter"}>{count}</div></div>
			<div className={"container "+listClass}>
				<ul>
					{this.renderNotifications()}
				</ul>
			</div>
		</div>;
	}
}

Notifications.propTypes = {
	activeTab: PropTypes.number,
	idx: PropTypes.number,
	setActiveTab: PropTypes.func.isRequired,
	setOpenArea: PropTypes.func.isRequired,
	count: PropTypes.number
};
