import React, { Component } from "react";
import { request } from "../utils";
import PropTypes from "prop-types";

export default class ProfilePreview extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: null
		};
	}
	
	componentDidMount() {
		this.loadUser();
	}
	
	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.user.userName !== this.props.user.userName) {
			this.loadUser();
		}
	}
	
	loadUser() {
		request.send("GET", "/user/"+this.props.user)
			.then(res => res.data)
			.then(user => this.setState({ user }));
	}
	
	render() {
		if (!this.state.user) return null;
		const imgPath = this.state.user.imgPath || process.env.PUBLIC_URL+"/images/profile-placeholder.png";
		const { userName, firstName, lastName, nFollowers, nFollowings, nPosts } = this.state.user;
		return <div className={"profile-preview"}>
			<div className={"avatar"}>
				<img src={imgPath}/>
			</div>
			<div className={"info"}>
				<span>@{userName}</span>
				<span>{firstName} {lastName}</span>
			</div>
			<div className={"stats"}>
				<span className={"followers"}>
					Followers: {nFollowers}
				</span>
				<span className={"following"}>
					Following: {nFollowings}
				</span>
				<span className={"posts"}>
					Posts: {nPosts}
				</span>
			</div>
		</div>;
	}
}

ProfilePreview.propTypes = {
	user: PropTypes.object
};
