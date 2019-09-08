import React, { Component } from "react"
import Swal from "sweetalert2"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import Unauthorized from "../utils/Unauthorized"
import Header from "../Elements/Header"
import AccountButtons from "../Elements/AccountButtons"
import Map from "../Elements/Map"

class AccountPage extends Component {
	constructor() {
		super()
		this.state = {
			data: null,
		}

		this.getAccountData = this.getAccountData.bind(this)
		this.submitVerification = this.submitVerification.bind(this)
		this.verifyVerification = this.verifyVerification.bind(this)
		this.verifyAccount = this.verifyAccount.bind(this)
		this.submitDelete = this.submitDelete.bind(this)
		this.verifyDelete = this.verifyDelete.bind(this)
		this.deleteAccount = this.deleteAccount.bind(this)
	}

	submitVerification() {
		console.log("Verify Account")
		customRequest("PATCH", `/admin/verifyUser/${this.state.data.id}`)
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
			Swal.fire({
				title: "Success",
				text: "User Account Verified",
				type: 'success',
			}).then(result => {
				window.location.reload()
			})
		}).catch(err => {
			displayError(err)
		})
	}

	verifyVerification() {
		Swal.fire({
			title: 'Are you sure?',
			text: "Verify User Account?",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
		 	cancelButtonColor: '#d33',
			confirmButtonText: 'Verify Account'
		}).then(result => {
			if(result.value) {
				this.submitVerification()
			}
		})
	}


	verifyAccount() {
		this.verifyVerification()
	}

	submitDelete() {
		console.log("Delete User Account")
		customRequest("DELETE", `/admin/deleteUser/${this.state.data.id}`)
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
			Swal.fire({
				title: "Success",
				text: "User Account Deleted",
				type: 'success',
			}).then(result => {
				this.props.history.goBack()
			})
		}).catch(err => {
			displayError(err)
		})
	}

	verifyDelete() {
    	Swal.fire({
    		title: 'Are you sure?',
    		text: "Delete User Account?",
    		type: 'warning',
    		showCancelButton: true,
    		confirmButtonColor: '#3085d6',
    	 	cancelButtonColor: '#d33',
    		confirmButtonText: 'Delete Account'
    	}).then(result => {
    		if(result.value) {
    			this.submitDelete()
    		}
    	})
    }

	deleteAccount() {
		this.verifyDelete()
	}

	getAccountData(username) {
		customRequest("GET", `/user/${username}`)
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)

			this.setState({
				data: response.data,
			})
		}).catch(err => {
			displayError(err)
		})
	}

	componentDidMount() {
		const path = this.props.location.pathname
		const pos = path.lastIndexOf("/")
		const username = path.slice(pos+1)
		const me = AuthHelper.me()
		if(!me || (!AuthHelper.isAdmin() && me.username !== username)) {
			return false
		}
		this.getAccountData(username)
	}

	render() {
		const path = this.props.location.pathname
		const pos = path.lastIndexOf("/")
		const username = path.slice(pos+1)
		const me = AuthHelper.me()
		if(!me || (!AuthHelper.isAdmin() && me.username !== username)) {
			return (
				<Unauthorized />
			)
		}

		if(this.state.data === null) {
			return (
				<p>Loading...</p>
			)
		}

		let city, country
		if(this.state.data.location) {
			let location = this.state.data.location.locationTitle.split(", ")
			city = location[0]
			country = location[1]
		}

		return (
			<div>
				<div className="home-header">
					<Header />
					<AccountButtons history={this.props.history} />
				</div>
				<h1 className="account-title">{this.state.data.username}</h1>
				<div className="account-page">
					<div className="account-page-info">
						<div className="account-info-flex">
							<div className="account-info-left">
								<p className="account-field"><label className="account-field-label">Username:</label> {this.state.data.username}</p>
								<p className="account-field"><label className="account-field-label">First Name:</label> {this.state.data.firstName}</p>
								<p className="account-field"><label className="account-field-label">Last Name:</label> {this.state.data.lastName}</p>
							</div>
							<div className="account-info-right">
								<p className="account-field"><label className="account-field-label">Email:</label> {this.state.data.email}</p>
								<p className="account-field"><label className="account-field-label">Tel Number:</label> {this.state.data.telNumber}</p>
								<p className="account-field"><label className="account-field-label">Tax Number:</label> {this.state.data.taxNumber}</p>
							</div>
						</div>
						
						<br />
						{this.state.data.location && this.state.data.location.latitude !== 0 && this.state.data.location.longitude !== 0 ? 
							<div>
								<p className="account-field"><label className="account-field-label">City:</label> {city}</p>
								<p className="account-field"><label className="account-field-label">Country:</label> {country}</p>
								<label className="account-field-label">Exact location:</label>
								<Map lat={this.state.data.location.latitude} lon={this.state.data.location.longitude} />
							</div>
							: <div>{this.state.data.location.locationTitle}</div>
						}
					</div>
					<div className="account-page-buttons">
						{this.state.data.verified ?
							<button className="btn btn-success btn-margin btn-set-size disabled" disabled>Verify Account</button>
							: <button className="btn btn-success btn-margin btn-set-size" onClick={this.verifyAccount}>Verify Account</button>
						}
						<br />
						{this.state.data.admin || this.state.data.verified ?
							<button className="btn btn-success btn-margin btn-set-size disabled" disabled>Delete Account</button>
							: <button className="btn btn-success btn-margin btn-set-size" onClick={this.deleteAccount}>Delete Account</button>
						}
					</div>
				</div>
			</div>
		)
	}
}

export default AccountPage