import React, { Component } from "react";
import ReactChartkick, { PieChart, ColumnChart } from "react-chartkick";
import Chart from "chart.js";
import Button from "react-bootstrap/Button";
import {request} from "../utils";
import PropTypes from "prop-types";

class UserHistory extends Component {
	constructor(props) {
		super(props);
		this.state = {
			users: []
		};
	}
	
	componentDidMount() {
		this.loadStatistics(this.props.mode);
	}

	loadStatistics(mode) {
		request.send("GET", "/statistics/admin/"+mode).then(res => res.data).then(stats => {
			this.setState({ users: stats.Registration });
		});
	}
	
	parseData() {
		return this.state.users.map((x, i) => {
			const prior = this.state.users.length - i - 1;
			const time = new Date();
			if (this.props.mode === "day") {
				time.setDate(time.getDate() - prior);
			} else if (this.props.mode === "week") {
				time.setDate(time.getDate() - 7*prior);
			} else {
				time.setMonth(time.getMonth() - prior);
			}
			return [time.toLocaleDateString(), x];
		});
	}
	
	
	render() {
		return <ColumnChart data ={this.parseData()} title = {"Number of user registration in the last " + this.props.mode + "s."}/>;
	}
}

UserHistory.propTypes = {
	mode: PropTypes.string.isRequired
};


export default class UserStatistic extends Component {
	constructor(props){
		super(props);

		this.state = {
			display: "day"
		};
	}


	componentDidMount() {
		this.loadStatistics();
	}

	loadStatistics() {
		request.send("GET", "/statistics/admin").then(res => res.data).then(data => {
			this.setState(state => Object.assign(state, data));
		});
	}
	handleClick(e, mode) {
		e.preventDefault();
		this.setState({ display: mode });
	}

	generateProfileData () {
		let totPrivate = this.state.numberPrivateProfile;
		let totPublic = this.state.numberPublicProfile;
		return [
			["Private Profile", totPrivate],
			["Public Profile", totPublic],
		];
	}

	render() {
		return <div className="users-statistics">
			<h1>Total number of users: {this.state.totalNumberUser} </h1>
			<PieChart data = {this.generateProfileData()} title={"Private and public profile distribution."}/>
			<div className="time-buttons">
				<Button onClick={e => this.handleClick(e, "day")}>Days</Button>
				<Button onClick={e => this.handleClick(e, "week")}>Weeks</Button>
				<Button onClick={e => this.handleClick(e, "month")}>Months</Button>
			</div>
			<UserHistory mode={this.state.display}/>
		</div>;
	}
}

ReactChartkick.addAdapter(Chart);
