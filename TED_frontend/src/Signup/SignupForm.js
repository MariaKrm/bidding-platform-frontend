import React from "react"
import AddressForm from "./AddressForm"
import "../styles/form_style.css"

function SignupForm(props) {
	return (
		<div className="signup-form-group">
			<form className="signup-form" onSubmit={props.handleSubmit}>
				<h2>Sign Up</h2>
			    <input 
			    	type="text" 
			    	value={props.data.username}
			    	name="username" 
			    	placeholder="Username" 
			    	onChange={props.handleChange}
			    	required
			    />
			    <br />
			    <input 
			    	type="password" 
			    	value={props.data.password} 
			    	name="password" 
			    	placeholder="Password" 
			    	onChange={props.handleChange}
			    	required
			    />
			    <input 
			    	type="password" 
			    	value={props.data.repeatPassword} 
			    	name="repeatPassword" 
			    	placeholder="Repeat Password" 
			    	onChange={props.handleChange}
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
			    <input 
			    	type="text" 
			    	value={props.data.email} 
			    	name="email" 
			    	placeholder="Email" 
			    	className="email-box"
			    	onChange={props.handleChange}
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