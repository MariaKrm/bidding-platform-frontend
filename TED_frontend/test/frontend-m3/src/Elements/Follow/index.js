import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import {request} from "../../utils";
import PropTypes from "prop-types";

const mapStateToProps = (state) => ({ user: state.user});

const StyledButton = styled.button`
	background: transparent
	border: 1px solid #111
	outline: 0
	padding: 0.25rem 0.5rem
	border-radius: 0.25rem
	text-transform: uppercase
	transition: 0.2s ease-in-out

	&:hover {
		cursor: pointer
		background: #111
		color: white
	}
`;


class ConnectedFollowUserButton extends Component {
	constructor(props) {
		super(props);
		this.state = {
			following: props.followUser.followed,
			private: props.followUser.privateProfile,
			request: props.followUser.requestSent
		};
		this.handleClick = this.handleClick.bind(this);
	}
	
	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.followUser.userName !== this.props.followUser.userName) {
			this.setState({
				following: nextProps.followUser.followed,
				private: nextProps.followUser.privateProfile,
				request: nextProps.followUser.requestSent
			});
		}
	}
	
	handleClick(event) {
		event.preventDefault();
		const method = (this.state.following) ? "DELETE" : "POST";
		request.send(method, `/user/follows/${this.props.followUser.userName}`).then(res => res.data).then(() => {
			if (this.state.following) {
				this.setState({ following: false, request: false });
			} else if (this.state.private) {
				this.setState({ following: false, request: true });
			} else {
				this.setState({ following: true, request: false });
			}
			if (this.props.handleFollow) {
				this.props.handleFollow();
			}
		});
	}
	
	renderText() {
		if (this.state.following) return "UNFOLLOW";
		if (this.state.request) return "PENDING";
		if (this.state.private) return "REQUEST";
		return "FOLLOW";
	}
	render() {
		return <StyledButton className="follow-btn" onClick={this.handleClick}>{this.renderText()}</StyledButton>;
	}
}

const FollowUserButton = connect(mapStateToProps)(ConnectedFollowUserButton);

ConnectedFollowUserButton.propTypes = {
	followUser: PropTypes.shape({
		followed: PropTypes.bool,
		privateProfile: PropTypes.bool,
		requestSent: PropTypes.bool,
		userName: PropTypes.string
	}),
	handleFollow: PropTypes.func
};

export default FollowUserButton;
