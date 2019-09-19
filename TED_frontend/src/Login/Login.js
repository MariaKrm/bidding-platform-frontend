import React, {Component} from "react"
import { Link } from "react-router-dom"
import { Redirect } from "react-router"
import axios from "axios"
import Header from "../Elements/Header"
import * as Constants from "../Constants/Constants"
import AuthHelper from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"



class Login extends Component {
    constructor() {
        super()
        this.state = {
        	username: "",
            password: "",
            redirect: false,
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.redirectToHome = this.redirectToHome.bind(this)
    }

    handleChange(event) {
    	const {name, value} = event.target
    	this.setState({ [name]: value })
    	
    }

    handleSubmit(event) {
        event.preventDefault()


        const user = {
            username: this.state.username,
            password: this.state.password
        }

        const loginRoute = Constants.BASEURL + "/auth/login"
        axios.post(loginRoute, user)
        .then(response => {
            AuthHelper.setToken(response.data.token)
            AuthHelper.setUser(response.data.user)
            this.setState({
                redirect: true
            })
        }).catch(err => {
            displayError(err)
        })
    }


    redirectToHome() {
        if(this.state.redirect) {
            return <Redirect to="./home" />
        }
    }

    
    render() {
        return (
            <div className="background">
                {this.redirectToHome()}
                <Header />
                <form className="login-form" onSubmit={this.handleSubmit}>
                    <br />
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
                    <button className="btn btn-dark btn-margin btn-set-size">Log in</button>
                    <br />
                    <br />
                    <p>Don't have an account? <Link to="./signup" className="form-link" type="link">Sign Up</Link></p>
                    <p>Or <Link to="./home" className="form-link" type="link">login as visitor</Link></p>
                    
                </form>
            </div>
        )
    }
}

export default Login