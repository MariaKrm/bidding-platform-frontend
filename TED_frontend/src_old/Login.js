import React, {Component} from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import Header from "./Header"
import Swal from "sweetalert2";
import "./style.css"


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
        event.preventDefault()
        console.log("username: ", this.state.username)
        console.log("password: ", this.state.password)
        //alert("Loging in as " + this.state.username + " with id " + id)
    //    this.props.history.push("/user/" + id)


        const user = {
            username: this.state.username,
            password: this.state.password
        }

        const loginRoute = "https://localhost:8443/auth/login"
        const testRoute = "https://localhost:8443/user/test/test"
        axios.post(loginRoute, user)
            .then(response => {
                console.log("post returned:")
                console.log("response ", response)
                console.log("response.data ", response.data)
                alert("POST " + loginRoute + "\nStatus: " + response.status + "\nStatus Text: " + response.statusText + "\nData: "+ response.data)
            }).catch(err => {
                console.log("POST ERROR")
                console.log(err)
                var errText
                if(err.response) {
                    errText = err.response.status + ": " + err.response.data.text
                }
                else {
                    errText = err
                }
                Swal.fire({
                    type: "error",
                    title: "Oops...",
                    text: errText,
                    footer: "<a href='/signup'>Don't have an account yet?</a>"
                })
            })

        axios.get(testRoute)
            .then(response => {
                console.log("get returned:")
                console.log("response ", response)
                console.log("response.data ", response.data)
                alert("GET " + testRoute + "\nStatus: " + response.status + "\nStatus Text: " + response.statusText + "\nData: "+ response.data)
            })
                
            .catch(err => {
                console.log("GET ERROR")
                console.log(err)
                var errText
                if(err.response) {
                    errText = err.response.status + ": " + err.response.data.text
                }
                else {
                    errText = err
                }
                Swal.fire({
                    type: "error",
                    title: "Oops...",
                    text: errText,
                    footer: "<a href='/signup'>Don't have an account yet?</a>"
                })
             })
    }
    
    render() {
        return (
            <div>
                <Header />
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
                    <p>Don't have an account? <Link to="./signup" className="form-link" type="link">Sign Up</Link></p>
                    <p>Or <Link to="./visitor" className="form-link" type="link">login as visitor</Link></p>
                    
                </form>
            </div>
        )
    }
}

export default Login