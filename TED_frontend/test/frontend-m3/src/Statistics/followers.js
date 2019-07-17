import React, { Component } from "react";
import ReactChartkick, { PieChart, LineChart} from "react-chartkick";
import Chart from "chart.js";
import PropTypes from "prop-types";
import { request} from "../utils";

export default class FollowerStats extends Component {
	constructor(props) {
		super(props);
		this.state = {
			followersLastSevenDays: null,
			numberPrivateFollower: 0,
			numberPublicFollower: 0
		};
	}
	
	componentDidMount() {
		ReactChartkick.addAdapter(Chart);
		this.loadStatistics();
	}
	
	loadStatistics() {
		request.send("GET", "/statistics/user").then(res => res.data).then(data => {
			this.setState(state => Object.assign({}, state, data));
		});
	}

	generateHistory() {
		if (this.state.followersLastSevenDays){
			const values = Object.values(this.state.followersLastSevenDays);
			const dayBack = 60000 * 60 * 24;
			return values.map((x, i) => {
				return [new Date(Date.now() - dayBack * (values.length - 1 - i)).toLocaleDateString().slice(0, -5),x];
			});
		}
		return [];
	}
	
	renderDistribution() {
		return [["Private", this.state.numberPrivateFollower], ["Public", this.state.numberPublicFollower]];
	}
	
	render (){
		return <div className = "Followers">
			<p>Here you can see the division between private and public profiles of your followers and how they changed in the last week.</p>
			<h3>Total number of followers: {this.props.followersUser}</h3>
			<PieChart
				title = {"Private-public profile's distribution"}
				data = {this.renderDistribution()}/>
			<LineChart
				title = {"Followers history"}
				data = {this.generateHistory()}/>
		</div>;
	}
}

FollowerStats.propTypes = {
	followersUser: PropTypes.number
};

