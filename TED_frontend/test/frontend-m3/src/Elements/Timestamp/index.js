import React, { Component } from "react";
import TimeAgo from "react-timeago";
import PropTypes from "prop-types";

export default class Timestamp extends Component {
	render() {
		return <div className="time timestamp">
			<TimeAgo date={this.props.since}/>
		</div>;
	}
}

Timestamp.propTypes = {
	since: PropTypes.number
};
