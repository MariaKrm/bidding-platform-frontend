import React, { Component } from "react";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { reset } from "../Redux/actions";
import PropTypes from "prop-types";

const mapDispatchToProps = dispatch => ({ reset: () => dispatch(reset()) });

class ConnectedLogout extends Component {
	componentDidMount() {
		this.handleLogout();
	}

	handleLogout() {
		this.props.reset();
		localStorage.removeItem("redux_storage");
	}

	render() {
		return <Redirect to='/login'/>;
	}
}

const Logout = connect(null, mapDispatchToProps)(ConnectedLogout);

ConnectedLogout.propTypes = {
	reset: PropTypes.func.isRequired
};
export default Logout;
