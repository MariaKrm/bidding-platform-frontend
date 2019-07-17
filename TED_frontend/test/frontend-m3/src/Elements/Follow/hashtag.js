import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { request } from "../../utils";

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
		// background: #111
		color: white
	}
`;


export default class FollowHashtagButton extends Component {
	constructor(props) {
		super(props);
		this.state = {
			following: false,
		};
		this.handleClick = this.handleClick.bind(this);
	}
	
	componentDidMount() {
		this.checkFollowed();
	}
	
	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.hashtag !== this.props.hashtag) return this.checkFollowed();
	}
	
	checkFollowed() {
		request.send("GET", "/user/hashtag").then(res => res.data).then(hashtags => {
			for (let i = 0; i < hashtags.length; i++) {
				if (hashtags[i].tag.slice(1) === this.props.hashtag) return this.setState({ following: true });
			}
			return this.setState({ following: false });
		});
	}
	
	handleClick() {
		if (this.state.following) {
			return request.send("DELETE", "/user/hashtag/"+this.props.hashtag).then(() => {
				this.setState({ following: false });
			});
		}
		return request.send("POST", "/user/hashtag/"+this.props.hashtag).then(() => {
			this.setState({ following: true });
		});
	}
	
	renderText() {
		if (this.state.following) return "UNFOLLOW";
		return "FOLLOW";
	}

	render() {
		return <StyledButton className="follow-btn" onClick={this.handleClick}>{this.renderText()}</StyledButton>;
	}
}

FollowHashtagButton.propTypes = {
	hashtag: PropTypes.string.isRequired,
	handleClick: PropTypes.func
};

