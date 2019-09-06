import React, { Component } from "react"
import Swal from "sweetalert2"
import { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"


class AccountOptions extends Component {
	constructor() {
		super()


		this.submitVerification = this.submitVerification.bind(this)
		this.verifyVerification = this.verifyVerification.bind(this)
		this.verifyAccount = this.verifyAccount.bind(this)
		this.submitDelete = this.submitDelete.bind(this)
		this.verifyDelete = this.verifyDelete.bind(this)
		this.deleteAccount = this.deleteAccount.bind(this)
	}

	submitVerification() {
		console.log("Verify Account")
		customRequest("PATCH", `/admin/verifyUser/${this.props.account.id}`)
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
		customRequest("DELETE", `/admin/deleteUser/${this.props.account.id}`)
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
			Swal.fire({
				title: "Success",
				text: "User Account Deleted",
				type: 'success',
			}).then(result => {
				window.location.reload()
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


	render() {
		return (
			<div>
				<button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
				<div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
					{this.props.account.verified ?
						<button className="dropdown-item disabled" disabled>Verify Account</button>
						: <button className="dropdown-item" onClick={this.verifyAccount}>Verify Account</button>
					}
					{this.props.account.admin ?
						<button className="dropdown-item disabled" disabled>Delete Account</button>
						: <button className="dropdown-item" onClick={this.deleteAccount}>Delete Account</button>
					}
					
				</div>
			</div>
		)
	}
}

export default AccountOptions