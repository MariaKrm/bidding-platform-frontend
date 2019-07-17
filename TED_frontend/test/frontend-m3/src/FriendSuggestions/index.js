import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { request } from "../utils";

import FollowButton from "../Elements/Follow";

class Suggestion extends Component {
	constructor(props){
		super(props);

		this.state = {
			following: false
		};

		this.handleClick = this.handleClick.bind(this);

	}

	handleClick() {
		this.setState({
			following: !this.state.following
		});
	}

	renderText(){
		if (this.props.commonFriends > 1) return this.props.commonFriends+" friends in common";
		if (this.props.commonFriends === 1) return "1 friend in common";
		return "No friends in common";
	}

	render() {
		const { userName, firstName, lastName } = this.props.user;
		const imgPath = this.props.user.imgPath || process.env.PUBLIC_URL+"/images/profile-placeholder.png";
		return <li className={"suggestion"}>
			<NavLink className={"target-user"} to={"/profile/"+userName}>
				<img className={"avatar"} alt={"user profile avatar"} src={imgPath}/>
				<div className={"user-info"}>
					<span>@{userName}</span>
					<span>{firstName}</span>
					<span>{lastName}</span>
				</div>
			</NavLink>
			<span>{this.renderText()}</span>
			<FollowButton followUser={this.props.user}/>
		</li>;
	}
}

export default class FriendSuggestions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			suggestions: []
		};
	}

	componentDidMount() {
		this.loadSuggestions();
	}

	loadSuggestions() {
		request.send("GET", "/user/friends/recommendations").then(res => res.data).then(suggestions => {
			this.setState({ suggestions });
		});
	}

	renderSuggestions() {
		return this.state.suggestions.map((suggestion, i) => {
			const { user, friendsInCommon } = suggestion;
			return <Suggestion key={i} user={user} commonFriends={friendsInCommon}/>;
		});

	}
	render(){
		
		return (this.state.suggestions.length > 0) ? <div className={"friend-recommendations"}>
			<div className={"friend-suggestions"}>
				<h3>Friend Recommendations</h3>
				<div className={"suggestions"}>
					<ul>
						{this.renderSuggestions()}
					</ul>
				</div>
			</div>
		</div> : null;
	}
}

Suggestion.propTypes = {
	user: PropTypes.string.isRequired,
	commonFriends: PropTypes.number,
};
