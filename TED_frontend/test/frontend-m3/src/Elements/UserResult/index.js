import {NavLink} from "react-router-dom";
import FollowUserButton from "../Follow";
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { request } from "../../utils";

const mapStateToProps = state => ({
	loggedUser: state.user,
});

class ConnectedUserResult extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			user: null,
			following: props.user.followed,
		};
		
		this.handleClick = this.handleClick.bind(this);
	}
	
	componentDidMount() {
		this.loadUser();
	}
	
	loadUser() {
		request.send("GET", "/user/"+this.props.user).then(res => res.data).then(user => {
			this.setState({ user });
		});
	}
	
	handleClick(event) {
		if (this.props.onClick) {
			this.props.onClick(event, this.props.user);
		}
		if (this.props.setModal) {
			this.props.setModal(false);
		}
	}
	
	render() {
		if (!this.state.user) return null;
		const { firstName, lastName, userName } = this.state.user;
		const imgPath = this.state.user.imgPath || process.env.PUBLIC_URL+"/images/profile-placeholder.png";
		const authorName = firstName+" "+lastName;
		const isLoggedUser = this.state.user.userName === this.props.loggedUser.userName;
		return <div className="user">
			<NavLink className="no-style profile-link" to={`/profile/${userName}`} onClick={this.handleClick}>
				<img className="avatar" src={imgPath} alt={authorName}/>
				<div>
					<span className="username">{userName}</span>
					<span className="name">{authorName}</span>
				</div>
			</NavLink>
			{!isLoggedUser && this.props.followAllowed && <div><FollowUserButton followUser={this.state.user} handleFollow={this.props.handleFollow}/></div>}
		</div>;
	}
}

const UserResult = connect(mapStateToProps)(ConnectedUserResult);

ConnectedUserResult.propTypes = {
	setModal: PropTypes.func,
	followAllowed: PropTypes.bool,
	user: PropTypes.shape({
		firstName: PropTypes.string,
		lastName: PropTypes.string,
		userName: PropTypes.string,
		followed: PropTypes.bool,
		imgPath: PropTypes.string
	}),
	loggedUser: PropTypes.shape({
		userName: PropTypes.string
	}),
	handleFollow: PropTypes.func,
	onClick: PropTypes.func
};

export default UserResult;
