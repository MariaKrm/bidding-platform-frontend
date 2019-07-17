import React, { Component } from "react";
import SeePassword from "./seepassword.js";
import { request } from "../utils";
import { Redirect } from "react-router";

export default class SettingsPassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
			oldPassword: "",
			newPassword: "",
			confirmNewPassword: "",
			validData: false,
			redirecting: false
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.validate = this.validate.bind(this);
	}

	validate() {
		const regEx = /^(?=.*[A-z])(?=.*[0-9])(?=.{8,})/;
		const { oldPassword, newPassword, confirmNewPassword } = this.state;
		const validData =
			regEx.test(oldPassword)
			&& regEx.test(newPassword)
			&& (oldPassword !== newPassword)
			&& (newPassword === confirmNewPassword);
		this.setState({
			validData
		});
	}

	handleChange(event){
		const { name: key, value } = event.target;
		this.setState({
			[key]: value,
		}, this.validate);
	}

	handleSubmit(event) {
		event.preventDefault();
		const { oldPassword, newPassword, validData } = this.state;
		if (!validData) return;
		request.send("PUT", "/account/change-password", {
			oldPassword,
			newPassword
		}).then(res => res.data).then(() => {
			this.setState({ redirecting: true });
		});
	}

	render() {
		return (<div className="passwordPage">
			{this.state.redirecting && <Redirect to={"/settings"}/>}
			<p>Change your password:</p>
			<form onSubmit={this.handleSubmit}>
				<SeePassword
					onChange={this.handleChange}
					placeholder="Enter Current Password"
					name="oldPassword"
				/>
				<SeePassword
					onChange={this.handleChange}
					placeholder="Enter New Password"
					name="newPassword"
				/>
				<SeePassword
					onChange={this.handleChange}
					placeholder="Confirm New Password"
					name="confirmNewPassword"
				/>

				<input disabled={!this.state.validData} type="submit" value="Change password"/>
			</form>
		</div>);
	}
}
