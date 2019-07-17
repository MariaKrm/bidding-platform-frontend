import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import {request} from "../utils";
import { Redirect } from "react-router-dom";

class ProfileNotFound extends Component {
	constructor(props){
		super(props);
		this.state = {
			redirecting: false
		};
		this.redirectBack = this.redirectBack.bind(this);
	}

	redirectBack(event) {
		event.preventDefault();
		this.props.history.goBack();
	}

	componentDidMount() {
		return request.send("GET", "/user/activities").catch(err => {
			if (err.response.status === 401) this.setState({ redirecting: true });
		});
	}
	
	render() {
		return <div className ={"profileNotFound"}>
			{this.state.redirecting && <Redirect to={"/logout"}/>}
			<div className={"iconNotFound"}>
				<img className="image404" src={process.env.PUBLIC_URL+"/images/404.svg"} alt={"404"}/>
			</div>
			<div className = {"ProfileNotFoundText"}>
				<h1>This profile does not exists.</h1>
				<a href='/' onClick={this.redirectBack}> Go Back </a>
			</div>
		</div>;
	}
}

ProfileNotFound.propTypes = {
	history: PropTypes.shape({
		goBack: PropTypes.func.isRequired
	})
};

export default withRouter(ProfileNotFound);

ProfileNotFound.propTypes = {
	history : PropTypes.shape({
		goBack : PropTypes.func.isRequired
	})
};
