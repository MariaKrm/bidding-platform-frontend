import React from "react"
import AddressForm from "./AddressForm"

class Signup extends React.Component {

	constructor() {
		super()
		this.state = {
			username: "",
			password: "",
			repeatPassword: "",
			firstname: "",
			lastname: "",
			email: "",
			phoneNumber: "",
			tin: "",
			coords: null,

		}

		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleAddressSubmit = this.handleAddressSubmit.bind(this)
	}

	handleChange(event) {
    	const {name, value} = event.target
    	this.setState({ [name]: value })
    	
    }

    handleSubmit(event) {
    	event.preventDefault()
    	if(this.state.password !== this.state.repeatPassword) {
    		alert("Passwords don't match.")
    		return false
    	}
    	else if(this.state.coords === null) {
    		alert("You have to enter a valid address.")
    		return false
    	}
    	else {
    		alert("You signed up. Good Job!\nYour coords are: " + this.state.coords.lat + ", " + this.state.coords.lon)
    		return true
    	}
    	
    }

    handleAddressSubmit(addressCoords) {
    	this.setState({
    		coords: addressCoords
    	})
    }

	render() {
		return (
			<div>
				<form className="signup-form" onSubmit={this.handleSubmit}>
					<h1>Sign Up</h1>
				    <input 
				    	type="text" 
				    	value={this.state.username} 
				    	name="username" 
				    	placeholder="Username" 
				    	onChange={this.handleChange}
				    	required
				    />
				    <br />
				    <input 
				    	type="password" 
				    	value={this.state.password} 
				    	name="password" 
				    	placeholder="Password" 
				    	onChange={this.handleChange}
				    	required
				    />
				    <input 
				    	type="password" 
				    	value={this.state.repeatPassword} 
				    	name="repeatPassword" 
				    	placeholder="Repeat Password" 
				    	onChange={this.handleChange}
				    	required
				    />

				    <br />
				    <br />

				    <input 
				    	type="text" 
				    	value={this.state.firstname} 
				    	name="firstname" 
				    	placeholder="First Name" 
				    	onChange={this.handleChange}
				    	required
				    />
				    <input 
				    	type="text" 
				    	value={this.state.lastname} 
				    	name="lastname" 
				    	placeholder="Last Name" 
				    	onChange={this.handleChange}
				    	required
				    />

				    <br />
				    <input 
				    	type="text" 
				    	value={this.state.email} 
				    	name="email" 
				    	placeholder="Email" 
				    	className="email-box"
				    	onChange={this.handleChange}
				    	required
				    />

				    <br />
				    <input 
				    	type="text" 
				    	value={this.state.phoneNumber} 
				    	name="phoneNumber" 
				    	placeholder="Phone Number" 
				    	onChange={this.handleChange}
				    	required
				    />

				    <br />
				    <input 
				    	type="text" 
				    	value={this.state.tin} 
				    	name="tin" 
				    	placeholder="TIN" 
				    	onChange={this.handleChange}
				    	required
				    />

				    <br />
				    <br />
				    <br />
				    <br />

				    <AddressForm onAddressSubmit={this.handleAddressSubmit} />

				    <br />
				    <br />

				    <button>Sign Up</button>
				    
				</form>
			</div>
		)
	}
}

export default Signup