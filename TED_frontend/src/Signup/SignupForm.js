import React from "react"
import AddressForm from "./AddressForm"

function SignupForm(props) {
	return (
		<form className="signup-form" onSubmit={props.handleSubmit}>
			<h1>Sign Up</h1>
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
		    <br />
		    <br />

		    <AddressForm onAddressSubmit={props.handleAddressSubmit} />

		    <br />
		    <br />

		    <button>Sign Up</button>
		    
		</form>
	)

}


export default SignupForm