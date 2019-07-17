import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import UserResult from "../UserResult";
import {request} from "../../utils";
import PropTypes from "prop-types";

const mapStateToProps = state => ({ user: state.user });

class ConnectedLikeList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			likes: []
		};
		
		this.loadLikes = this.loadLikes.bind(this);
	}
	
	componentDidMount() {
		this.loadLikes();
	}
	
	loadLikes() {
		request.send("GET", `/post/${this.props.postId}/likes`).then(res => res.data).then(likes => {
			this.setState({ likes });
		});
	}
	
	renderUsers() {
		const users = this.state.likes.map(like => like.userName);
		if (users.length === 0) return null;
		return users.map((x, i) => {
			return <UserResult user={x} key={i} followAllowed={true}/>;
		});
	}
 
	render() {
		return <Fragment>
			<div className='header'>Likes</div>
			<div className="container">
				{this.renderUsers()}
			</div>
		</Fragment>;
	}
}

ConnectedLikeList.propTypes = {
	postId: PropTypes.string
};

const LikeList = connect(mapStateToProps)(ConnectedLikeList);

export default LikeList;
