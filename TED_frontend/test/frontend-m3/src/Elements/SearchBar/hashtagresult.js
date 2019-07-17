import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";


export default class HashtagResult extends Component {
	constructor(props) {
		super(props);
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
	}
	
	handleMouseEnter() {
		this.props.setActive(this.props.index);
	}
	
	
	render() {
		const { result } = this.props;
		return <NavLink
			to={`/hashtag?hashtag=${result.tag.slice(1)}`}
			className={"search-result "+this.props.className}
			onMouseEnter={this.handleMouseEnter}
		>
			<div className="hashtag-info">
				<i className="fas fa-hashtag"/>
				<span className="hashtag-name">{result.tag.slice(1)}</span>
			</div>
			<div className="hashtag-stat">
				Posts: {result.nPosts}
			</div>
		</NavLink>;
	}
}

HashtagResult.propTypes = {
	result: PropTypes.object.isRequired,
	className: PropTypes.string,
	setActive: PropTypes.func.isRequired,
	index: PropTypes.number.isRequired
};
