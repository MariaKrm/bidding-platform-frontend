import React, { Component } from "react";
import ReactChartkick, {ColumnChart} from "react-chartkick";
import Chart from "chart.js";
import Button from "react-bootstrap/Button";
import { request } from "../utils";
import PropTypes from "prop-types";

class PostHistory extends Component {
	constructor(props) {
		super(props);
		this.state = {
			posts: []
		};
	}
	
	componentDidMount() {
		this.loadStatistics(this.props.mode);
	}
	
	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.mode !== this.props.mode) {
			this.loadStatistics(nextProps.mode);
		}
	}
	
	loadStatistics(mode) {
		request.send("GET", "/statistics/admin/"+mode).then(res => res.data).then(stats => {
			this.setState({ posts: stats.Posts });
		});
	}
	
	parseData() {
		return this.state.posts.map((x, i) => {
			const prior = this.state.posts.length - i - 1;
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
		return <ColumnChart data ={this.parseData()} title = {"Number of posts in the last " + this.props.mode + "s."}/>;
	}
}

PostHistory.propTypes = {
	mode: PropTypes.string.isRequired
};

export default class PostStatistic extends Component {
	constructor(props){
		super(props);

		this.state = {
			display: "day",
		};
	}

	componentDidMount() {
		ReactChartkick.addAdapter(Chart);
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

	generateAverageWeekDay() {
		let { postPerWeekDays: avg} = this.state;
		if (!avg) {
			return [];
		}
		const dayData = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		return dayData.map((x, i) => {
			return [x, avg[i + 1]];
		});
	}
	render() {

		return <div className="posts-statistics">
			<h1>Total number of posts: {this.state.totalPost}</h1>
			<div className="time-buttons">
				<Button onClick={e => this.handleClick(e, "day")}>Days</Button>
				<Button onClick={e => this.handleClick(e, "week")}>Weeks</Button>
				<Button onClick={e => this.handleClick(e, "month")}>Months</Button>
			</div>
			<PostHistory mode={this.state.display}/>
			<ColumnChart
				data ={this.generateAverageWeekDay()}
				title = {"Number of new posts in average per weekday "}
				messages={{empty: "No data"}}
			/>

		</div>;
	}
}


