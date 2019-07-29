import React from "react"
import AddressForm from "./AddressForm"
import ValidatedInput from "../ValidatedInput"
import "../styles/form_style.css"

function SignupForm(props) {
	return (
		<div className="signup-form-group">
			<form className="signup-form" onSubmit={props.handleSubmit}>
				{props.data.error && props.data.error !== "" && <div className="form-error-message">{props.data.error} </div>}
				<h2>Sign Up</h2>
			    <ValidatedInput 
			    	type="text"
			    	name="username" 
			    	placeholder="Username" 
			    	passresult={props.passresult}
			    	required
			    />
			    <br />
			    <ValidatedInput 
			    	type="password" 
			    	name="password" 
			    	placeholder="Password" 
			    	passresult={props.passresult}
			    	required
			    />
			    <ValidatedInput 
			    	type="password"
			    	name="confirmPassword" 
			    	placeholder="Confirm Password" 
			    	passresult={props.passresult}
			    	password={props.data.password}
			    	required
			    />

			    <br />
			    <br />

			    <input 
			    	type="text" 
			    	value={props.data.firstname} 
			    	name="firstname" 
			    	placeholder="First Name" 
			    	onChange={props.handleChange}
			    	required
			    />
			    <input 
			    	type="text" 
			    	value={props.data.lastname} 
			    	name="lastname" 
			    	placeholder="Last Name" 
			    	onChange={props.handleChange}
			    	required
			    />

			    <br />
			    <ValidatedInput 
			    	type="text" 
			    	name="email" 
			    	placeholder="Email" 
			    	className="email-box"
			    	passresult={props.passresult}
			    	required
			    />

			    <br />
			    <input 
			    	type="text" 
			    	value={props.data.phoneNumber} 
			    	name="phoneNumber" 
			    	placeholder="Phone Number" 
			    	onChange={props.handleChange}
			    	required
			    />

			    <br />
			    <input 
			    	type="text" 
			    	value={props.data.tin} 
			    	name="tin" 
			    	placeholder="TIN" 
			    	onChange={props.handleChange}
			    	required
			    />

			    <br />
			    <br />

			    <button className="submit-button">Sign Up</button>
			    
			</form>

			<AddressForm onAddressSubmit={props.handleAddressSubmit} />
		</div>
	)

}


export default SignupForm