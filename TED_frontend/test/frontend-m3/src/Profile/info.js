import React, {Component} from "react";
import { NavLink, Redirect } from "react-router-dom";
import FollowUserButton from "../Elements/Follow";
import PropTypes from "prop-types";

import Statistics from "./stats.js";

import { connect } from "react-redux";
import BlockUserButton from "../Elements/Block";

const mapStateToProps = (state) => ({ user: state.user});

const SettingsButton = () => {
	return <NavLink to="/settings">
		<button>Edit Profile</button>
	</NavLink>;
};

class ProfileInfoConnected extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirecting: false,
			redirectPath: "/"
		};
		
		this.handleBlockUser = this.handleBlockUser.bind(this);
	}
	
	handleBlockUser() {
		this.setState({
			redirecting: true,
			redirectPath: "/blocked"
		});
	}
	
	renderRedirect() {
		return <Redirect to={this.state.redirectPath}/>;
	}
	
	render() {
		const { displayUser, user } = this.props;
		const imgPath = displayUser.imgPath || process.env.PUBLIC_URL+"/images/profile-placeholder.png";
		const isOwnProfile = displayUser.userName === user.userName;
		const isAdmin = displayUser.admin;
		
		return 	<div className='header'>
			{this.state.redirecting && this.renderRedirect()}
			<div className='avatar'>
				<img src={imgPath} alt={`${displayUser.userName}'s avatar`}/>
			</div>
			<div className='title'>
				<h3 className='profileName'>{displayUser.userName}</h3>
				<div className='info'>
					<p>{displayUser.bio}</p>
				</div>
				<div className={"interaction"}>
					{isOwnProfile ? <SettingsButton user={displayUser}/> : <div className={"interaction"}>
						<FollowUserButton handleFollow={this.props.reloadData} followUser={displayUser}/>
						<BlockUserButton onClick={this.handleBlockUser} user={displayUser}/>
					</div>}
					<NavLink className={"profile-link geomap-link"} to={"/geomap/"+displayUser.userName}><i className="fas fa-globe-europe"/></NavLink>
					{!isOwnProfile && <NavLink className={"profile-link chat-link"} to={"/messages/"+displayUser.userName}><i className="fas fa-comment-dots"/></NavLink>}
					{isOwnProfile && isAdmin ? <NavLink className={"profile-link admin-button"} to={"/admin/postsStat"}><i className="fas fa-user-secret"/></NavLink> : null  }
					{isOwnProfile ? <NavLink className={"profile-link chart-button"} to={"/statistics/followers"}><i className="fas fa-chart-line"/></NavLink> : null  }
					{!isOwnProfile && !displayUser.followed && <NavLink className={"profile-link path-link"} to={"/shortestPath/"+displayUser.userName}><i className="fas fa-project-diagram"/></NavLink>}
				</div>
	
			</div>
			<Statistics
				displayUser={displayUser}
				handleFollow={this.props.reloadData}
			/>
		</div>;
	}

}

const ProfileInfo = connect(mapStateToProps)(ProfileInfoConnected);

export default ProfileInfo;

ProfileInfoConnected.propTypes = {
	displayUser : PropTypes.shape({
		nPosts : PropTypes.number,
		nFollowers : PropTypes.number,
		nFollowings : PropTypes.number
	}),
	user : PropTypes.shape ({
		userName: PropTypes.string
	}),
	reloadData : PropTypes.func.isRequired
};
