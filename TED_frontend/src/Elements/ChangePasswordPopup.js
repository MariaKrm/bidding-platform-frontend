import React, { Component } from "react"
import Swal from "sweetalert2"
import { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import ValidatedInput from "../Elements/ValidatedInput"

class ChangePasswordPopup extends Component {
	constructor() {
		super()
		this.state = {
			oldPassword: "",
			password: "",
			confirmPassword: "",
		}

		this.passresult = this.passresult.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	//Called on onChange events of ValidatedInput fields
	passresult(name, value, error) {
		//Only keep the value if there are no errors
    	if(error !== null) {
    		value = null
    	}
    	this.setState({
    		[name]: value,
    	})
    }

    handleChange(event) {
    	const {name, value} = event.target
    	this.setState({
    		[name]: value,
    	})
    }

    handleSubmit(event) {
    	event.preventDefault()
    	let errorMessage = ""
    	const errors = !this.state.oldPassword || !this.state.password || !this.state.confirmPassword
    	if(errors) {
    		errorMessage = "Please fix the mistakes first."
    	}

    	this.setState({
    		error: errorMessage
    	})

    	 //Do not allow submit if there are errors
    	if(errorMessage) return false


		customRequest("PUT", "/account/changePassword", {oldPassword: this.state.oldPassword, newPassword: this.state.password})
		.then(response => {
			Swal.fire({
				title: "Success",
				text: response.data.text,
				type: 'success',
			})
		}).catch(err => {
			displayError(err)
		})
    }

	render() {
		return (
			<div className="modal" id="changePasswordModal">
				<div className="modal-dialog">
					<div className="modal-content">

						<div className="modal-header">
							<h4 className="modal-title font-weight-bold">Change Password</h4>
							<button type="button" className="close" data-dismiss="modal">&times;</button>
						</div>

						<div className="modal-body">
							<form>
								{this.state.error && this.state.error !== "" && <div className="alert-danger"><strong>{this.state.error}</strong> </div>}
								<input
									type="password"
									value={this.state.oldPassword}
									name="oldPassword"
									placeholder="Previous Password"
									onChange={this.handleChange}
									required
								/>
								<ValidatedInput 
									type="password" 
									value={this.state.password}
									name="password" 
									placeholder="New Password"
									passresult={this.passresult}
									required
								/>
								<ValidatedInput 
									type="password"
									value={this.state.confirmPassword}
									name="confirmPassword" 
									placeholder="Confirm Password"
									passresult={this.passresult}
									password={this.state.password}
									required
								/>
							</form>
						</div>

						<div className="modal-footer">
							<button type="button" className="btn btn-success" data-dismiss="modal" onClick={this.handleSubmit}>Submit</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default ChangePasswordPopup