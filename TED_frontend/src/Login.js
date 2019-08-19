import React, {Component} from "react"
import { Link } from "react-router-dom"
import { Redirect } from "react-router"
import axios from "axios"
import Header from "./Elements/Header"
import Swal from "sweetalert2"
import * as Constants from "./Constants/Constants"
import AuthHelper from "./utils/AuthHelper"



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
        console.log("username: ", this.state.username)
        console.log("password: ", this.state.password)


        const user = {
            username: this.state.username,
            password: this.state.password
        }

        const loginRoute = Constants.BASEURL + "/auth/login"
        axios.post(loginRoute, user)
        .then(response => {
            console.log("post returned:")
            console.log("response ", response)
            console.log("response.data ", response.data)
            AuthHelper.setToken(response.data.token)
            AuthHelper.setUser(response.data.user)
            console.log("isAdmin: ", response.data.user.admin)
            this.setState({
                redirect: true
            })
        }).catch(err => {
            console.log("POST ERROR")
            console.log(err)
            var errText = err.response ? err.response.status + ":" + err.response.data.text : err
            Swal.fire({
                type: "error",
                title: "Oops...",
                text: errText,
                footer: "<a href='/signup'>Don't have an account yet?</a>"
            })
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
                {/*    <img src={require("./images/hammer_icon_small.png")} alt="logo"/> */}
                {/*    <img src={require("./images/cow.png")} alt="logo"/> */}
                {/*    <img src={require("./images/cow_logo1_150.png")} alt="cow_logo" />*/}
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
                    <button className="submit-button">Log in</button>
                    <br />
                    <br />
                    <p>Don't have an account? <Link to="./signup" className="form-link" type="link">Sign Up</Link></p>
                    <p>Or <Link to="./visitor" className="form-link" type="link">login as visitor</Link></p>
                    
                </form>
            </div>
        )
    }
}

export default Login