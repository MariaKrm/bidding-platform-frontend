import React, { Component, Fragment } from "react";

import Activities from "./activities";
import Notifications from "./notifications";
import FollowRequests from "./followrequest";
import { request } from "../utils";
import PropTypes from "prop-types";


class UserTab extends Component {
	constructor(props) {
		super(props);

		this.state = {
			activeTab: 0,
		};

		this.userTab = React.createRef();

		this.handleClick = this.handleClick.bind(this);
		this.setActiveTab = this.setActiveTab.bind(this);
	}

	componentDidMount() {
		document.body.addEventListener("click", this.handleClick);
		document.body.style.overflowY = "hidden";
		const { current: userTab } = this.userTab;
		setTimeout(() => userTab.classList.add("show"), 0);
	}

	componentWillUnmount() {
		document.body.removeEventListener("click", this.handleClick);
		document.body.style.overflowY = "auto";
	}

	setActiveTab(idx) {
		switch (this.state.activeTab) {
		case 1: this.props.setCount("notifications", 0); break;
		case 2: this.props.setCount("activities", 0); break;
		default: break;
		}
		if (idx === this.state.activeTab) {
			idx = 0;
		}
		this.setState({ activeTab: idx });
	}

	handleClick(event) {
		const { current: bell } = this.props.bell;
		const { current: userTab } = this.userTab;
		if (!userTab.contains(event.target) && !bell.contains(event.target)) {
			userTab.classList.remove("show");
			setTimeout(() => {
				this.props.setOpenArea(false);
				this.props.loadCounts();
			}, 250);
		}
	}

	render() {
		return <div ref={this.userTab} className={"notifications user-area"}>
			<div className={"content"}>
				<Notifications idx={1} count={this.props.notifications} activeTab={this.state.activeTab} setOpenArea={this.props.setOpenArea} setActiveTab={this.setActiveTab}/>
				<Activities idx={2} count={this.props.activities} activeTab={this.state.activeTab} setOpenArea={this.props.setOpenArea} setActiveTab={this.setActiveTab}/>
				<FollowRequests idx={3} count={this.props.requests} activeTab={this.state.activeTab} setOpenArea={this.props.setOpenArea} setActiveTab={this.setActiveTab} setCount={this.props.setCount}/>
			</div>
		</div>;
	}
}

UserTab.propTypes = {
	setCount: PropTypes.func.isRequired,
	bell: PropTypes.shape({
		current: PropTypes.object
	}),
	setOpenArea: PropTypes.func.isRequired,
	loadCounts: PropTypes.func.isRequired,
	notifications: PropTypes.number,
	activities: PropTypes.number,
	requests: PropTypes.number

};

export default class UserArea extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			notifications: 0,
			activities: 0,
			requests: 0
		};

		this.bell = React.createRef();
		this.interval = null;

		this.setOpenArea = this.setOpenArea.bind(this);
		this.setCount = this.setCount.bind(this);
		this.loadCounts = this.loadCounts.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount() {
		this.loadCounts();
		this.interval = setInterval(this.loadCounts, 5000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	loadCounts() {
		return request.send("GET", "/user/activities").then(res => res.data).then(data => {
			const { notifications, activities, requests } = data;
			this.setState({ activities, notifications, requests });
		});
	}

	handleClick() {
		this.loadCounts().then(() => {
			if (this.props.active || this.state.open) return this.setOpenArea(false);
			this.setOpenArea(true);
		});
	}

	setCount(key, value) {
		this.setState({
			[key]: value
		});
	}

	setOpenArea(open) {
		this.setState({ open });
	}

	render() {
		const { notifications, activities, requests } = this.state;
		const sum = notifications+activities+requests;
		return <Fragment>
			<div ref={this.bell} className="nav-item nav-activities" onClick={this.handleClick}>
				<i className="fas fa-bell"/>
				{ sum > 0 && <span className={"counter"}>{sum}</span>}
			</div>
			{this.state.open && <UserTab
				setOpenArea={this.setOpenArea}
				bell={this.bell}
				notifications={notifications}
				activities={activities}
				requests={requests}
				setCount={this.setCount}
				loadCounts={this.loadCounts}
			/>}
		</Fragment>;
	}
}

UserArea.propTypes = {
	active: PropTypes.bool
};
