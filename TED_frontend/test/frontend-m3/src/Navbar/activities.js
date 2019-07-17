import React, {Component, Fragment} from "react";
import { NavLink } from "react-router-dom";
import UserLink from "../Elements/UserLink";
import Timestamp from "../Elements/Timestamp";
import {request} from "../utils";
import PropTypes from "prop-types";

class Activity extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.props.setOpenArea(false);
	}

	renderActivity() {
		const { activity } = this.props;
		const { author, type, followed, post } = activity;
		switch (type) {
		case "follow": return <Fragment>
			<UserLink user={author} onClick={this.handleClick}/> started following <NavLink to={`/profile/${followed.userName}`}>{followed.userName}</NavLink>
		</Fragment>;
		case "like": return <Fragment>
			<UserLink user={author} onClick={this.handleClick}/> liked this <NavLink to={`/profile/${post.author}/post/${post.id}`}>post</NavLink>
		</Fragment>;
		case "comment": return <Fragment>
			<UserLink user={author} onClick={this.handleClick}/> commented on this <NavLink to={`/profile/${post.author}/post/${post.id}`}>post</NavLink>
		</Fragment>;
		case "post": return <Fragment>
			<UserLink user={author} onClick={this.handleClick}/> submitted a new <NavLink to={`/profile/${author.userName}/post/${post.id}`}>post</NavLink>
		</Fragment>;
		default: return null;
		}
	}

	render() {
		const { activity } = this.props;
		const { author } = activity;
		const imgPath = author.imgPath || process.env.PUBLIC_URL+"/images/profile-placeholder.png";
		const newClassName = !(activity.seen) ? "new" : "";
		return <li className={"activity "+ newClassName}>
			<NavLink to={`/profile/${author.userName}`}><img className={"avatar"} alt={`${author.userName}'s avatar`} src={imgPath}/></NavLink>
			<div className={"info"}>
				{this.renderActivity()}
				<Timestamp since={this.props.activity.createdAt}/>
			</div>
			{/*{this.renderPreview()}*/}
		</li>;
	}
}

Activity.propTypes = {
	setOpenArea: PropTypes.func.isRequired,
	activity: PropTypes.object,
};


export default class Activities extends Component {
	constructor(props) {
		super(props);

		this.state = {
			activities: [],
		};

		this.handleClick = this.handleClick.bind(this);
		this.loadActivities = this.loadActivities.bind(this);
	}

	loadActivities() {
		return request.send("GET", "/user/activities/following").then(res => res.data).then(activities => {
			activities.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
			this.setState({ activities: [].concat(activities) });
		});
	}

	handleClick() {
		const isActive = this.props.activeTab === this.props.idx;
		if (isActive) return this.props.setActiveTab(this.props.idx);
		this.loadActivities().then(() => this.props.setActiveTab(this.props.idx));
	}

	renderActivities() {
		const { activities } = this.state;
		return activities.map((activity, i) => {
			return <Activity activity={activity} key={i} setOpenArea={this.props.setOpenArea}/>;
		});
	}

	render() {
		const { count } = this.props;
		const listClass = (this.props.activeTab === this.props.idx) ? "show" : "";
		const emptyClass = !(count > 0) ? "empty" : "";
		return <div className={"user-area-item "+listClass}>
			<div className={"header "+emptyClass} onClick={this.handleClick}>Following Activities <div className={"counter"}>{count}</div></div>
			<div className={"container "+listClass}>
				<ul>
					{this.renderActivities()}
				</ul>
			</div>
		</div>;
	}
}

Activities.propTypes = {
	activeTab: PropTypes.number,
	idx: PropTypes.number,
	setActiveTab: PropTypes.func.isRequired,
	setOpenArea: PropTypes.func.isRequired,
	count: PropTypes.number
};
