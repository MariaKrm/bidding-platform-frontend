import React, { Component, Fragment } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";


export default class Caption extends Component {
	constructor(props) {
		super(props);
		
		this.maxChars = 120;
		
		this.state = {
			viewAll: this.props.content.length < this.maxChars,
		};

		this.handleClick = this.handleClick.bind(this);
		this.showMore = this.showMore.bind(this);
	}
	
	showMore(e) {
		e.preventDefault();
		this.setState({ viewAll: true });
	}

	parseContent(content) {
		const regEx = /(#\w\w+)|(@\w{6,})/gm;
		if (!content) return content;
		content = content.replace(regEx, matched => `~${matched}~`);
		content = content.split("~").map((element, i) => {
			if (element[0] === "#") {
				element = element.slice(1);
				return <NavLink key={i} to={"/hashtag?hashtag="+element}>#{element}</NavLink>;
			}
			if (element[0] === "@") {
				if (element.length < 7) return element;
				element = element.slice(1);
				return <NavLink key={i} to={"/profile/"+element}>@{element}</NavLink>;
			}
			return element;
		});
		return content;
	}
	
	renderDescription() {
		let description;
		if (this.state.viewAll) {
			description = this.props.content;
			return this.parseContent(description);
		}
		description = this.props.content.slice(0, this.maxChars).split(" ");
		description.pop();
		description = description.join(" ");
		return <Fragment>{this.parseContent(description)}... <a href="/" onClick={this.showMore} className="show-more">See more</a></Fragment>;
	}
	
	
	handleClick(event) {
		event.preventDefault();
		this.setState({ viewAll: true });
	}

	render() {
		return <div className="caption">{this.renderDescription()}</div>;
	}
}

Caption.propTypes = {
	content: PropTypes.string
};
