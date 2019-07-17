import React, { Component } from "react";
import ReactChartkick, { PieChart} from "react-chartkick";
import Chart from "chart.js";
import PropTypes from "prop-types";
import { request } from "../utils";


export default class FollowingStats extends Component {
	constructor(props) {
		super(props);
		this.state = {
			numberPrivateFollowing: 0,
			numberPublicFollowing: 0,
			numberFollowing: 0
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

	renderDistribution() {
		return [["Private", this.state.numberPrivateFollowing], ["Public", this.state.numberPublicFollowing]];
	}

	render (){
		return <div className = "Following">
			<p>Here you can see the division between private and public profiles that you are following.</p>
			<p>Total number of followings: {this.state.numberFollowing}</p>
			<PieChart
				title = {"Private-public profile's distribution"}
				data = {this.renderDistribution()}
			/>
		</div>;
	}
}

FollowingStats.propTypes = {
	followingsUser: PropTypes.number
};


