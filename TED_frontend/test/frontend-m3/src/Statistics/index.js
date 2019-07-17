import React, { Component } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import { Route, Switch, NavLink } from "react-router-dom";
import FollowerStats from "./followers";
import FollowingStats from "./following";
import TopPosts from "./top3";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {request} from "../utils";


const mapStateToProps = (state) => ({
	user: state.user
});

class Statistics extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount(){
		this.loadStatistics();
	}

	loadStatistics() {
		request.send("GET", "/statistics/user").then(res => res.data).then(data => {
			this.setState(state => Object.assign({}, state, data));
		});
	}

	render () {
		return <div className="statistics-page">
			<Jumbotron>
				<h1>Statistics page</h1>
				<p>Welcome to the statistics page!
					<br/>Here you can find some statistics about your profile.</p>
			</Jumbotron>
			<h3>Total number of posts: {this.props.user.nPosts}</h3>
			<div className="mode-buttons">
				<NavLink activeclassname="active" to={"/statistics/followers"}>Followers</NavLink>
				<NavLink activeclassname="active" to={"/statistics/followings"}>Followings</NavLink>
				<NavLink activeclassname="active" to={"/statistics/topPosts"}>Posts</NavLink>
			</div>

			<Switch>
				<Route path={"/statistics/followers"} render={() =>
					<FollowerStats followersUser = {this.props.user.nFollowers}/>}/>
				<Route path={"/statistics/followings"} render={() =>
					<FollowingStats followingsUser = {this.props.user.nFollowings}/>} />
				<Route path={"/statistics/topPosts"} component = {TopPosts}/>
			</Switch>
		</div>;
	}
}

Statistics.propTypes = {
	user : PropTypes.shape({
		nPosts : PropTypes.number,
		nFollowers: PropTypes.number,
		nFollowings: PropTypes.number
	}),
};

export default connect(mapStateToProps)(Statistics);
