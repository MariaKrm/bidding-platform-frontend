import React, { Component } from "react";
import PropTypes from "prop-types";

export default class RequestError extends Component {
	constructor(props) {
		super(props);
		
		this.request = React.createRef();
		this.handleUnmount = this.handleUnmount.bind(this);
		this.handleMount = this.handleMount.bind(this);
	}
	
	componentDidMount() {
		setTimeout(this.handleMount, 250);
		setTimeout(this.handleUnmount, this.props.TTL - 250);
	}
	
	handleMount() {
		const {current: request } = this.request;
		if (!request) return;
		request.classList.add("show");
	}
	
	handleUnmount() {
		const {current: request } = this.request;
		if (!request) return;
		request.classList.remove("show");
	}
	
	render() {
		return <div ref={this.request} className={"request-error"}>
			<span className={"status-code"}>{this.props.error.statusCode}</span>: <span className={"message"}>{this.props.error.message}</span>
		</div>;
	}
}

RequestError.propTypes = {
	TTL: PropTypes.number,
	error: PropTypes.shape({
		statusCode: PropTypes.number,
		message: PropTypes.string
	})
};
