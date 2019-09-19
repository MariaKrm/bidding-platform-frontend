import React, { Component } from "react"
import Swal from "sweetalert2"
import { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"

class AccountManagmentControl extends Component {
	constructor() {
		super()

		this.submitVerification = this.submitVerification.bind(this)
		this.verifyVerification = this.verifyVerification.bind(this)
		this.verifyAll = this.verifyAll.bind(this)
	}

	submitVerification() {
		customRequest("PATCH", "/admin/verifyAll")
		.then(response => {
			Swal.fire({
				title: "Success",
				text: "All User Accounts Verified",
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
			text: "Verify All User Accounts?",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
		 	cancelButtonColor: '#d33',
			confirmButtonText: 'Verify All'
		}).then(result => {
			if(result.value) {
				this.submitVerification()
			}
		})
	}


	verifyAll() {
		this.verifyVerification()
	}

	render() {
		return (
			<div className="managment-control">
				<br />
				<br />
				<button type="button" className="btn btn-success btn-margin btn-set-size" onClick={this.verifyAll}>Verify All</button>
				<br />
				<br />

				<nav className="navbar navbar-expand-sm bg-light navbar-light">
					<ul className="nav flex-column ml-auto text-right">
						<li className="nav-item">
							<a className="nav-link active" href="/account-managment/pending-registers">Pending Registers</a>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="/account-managment/all-accounts">All Accounts</a>
						</li>
					</ul>
				</nav>

			</div>
		)
	}
}

export default AccountManagmentControl