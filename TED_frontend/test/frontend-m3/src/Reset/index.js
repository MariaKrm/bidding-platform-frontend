import React, { Component } from "react";
import PasswordRequest from "./request.js";
import PasswordReset from "./reset.js";
import { Switch, Route } from "react-router";

export default class Reset extends Component {
	render() {
		return <div className='reset'>
			<Switch>
				<Route exact path={"/reset"} component={PasswordRequest}/>
				<Route exact path={"/reset/password"} component={PasswordReset}/>
			</Switch>
		</div>;
	}
}
