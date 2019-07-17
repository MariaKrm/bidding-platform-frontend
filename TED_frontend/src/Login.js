import React, {Component} from "react"
import { Link, BrowserRouter } from "react-router-dom"
import { Router, Route } from "react-router"
import Signup from "./Signup"
import VisitorPage from "./VisitorPage"
import UserPage from "./UserPage"



class Login extends Component {
    constructor() {
        super()
        this.state = {
        	username: "",
            password: ""
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
    	const {name, value} = event.target
    	this.setState({ [name]: value })
    	
    }

    handleSubmit(event) {
        const id = 123
        event.preventDefault()
        console.log("username: ", this.state.username)
        console.log("password: ", this.state.password)
        alert("Loging in as " + this.state.username + " with id " + id)
    //    this.props.history.push("/user/" + id)
    }
    
    render() {
        return (
            <div>

                <form className="login-form" onSubmit={this.handleSubmit}>
                    <input 
                    	type="text" 
                    	value={this.state.username} 
                    	name="username" 
                    	placeholder="Username" 
                    	onChange={this.handleChange}
                    />
                    <br />
                    <input 
                    	type="password" 
                    	value={this.state.password} 
                    	name="password" 
                    	placeholder="Password" 
                    	onChange={this.handleChange}
                    />

                    <br />
                    <br />
                    <button>Log in</button>
                    <br />
                    <p>Don't have an account? <Link to="./signup" className="form-link" type="link" component={Signup}>Sign Up</Link></p>
                    <p>Or <Link to="./visitor" className="form-link" type="link" component={VisitorPage}>login as visitor</Link></p>
                    
                </form>
            </div>
        )
    }
}

export default Login