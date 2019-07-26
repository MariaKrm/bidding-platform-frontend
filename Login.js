import React, {Component} from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import Header from "./Header"
import "./style.css"
import Swal from "sweetalert2";



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
        axios.post('https://localhost:8443/auth/login', user)
            .then(response => {
                console.log("post returned:")
                console.log("response ", response)
                console.log("response.data ", response.data)
                alert("POST https://localhost:8443/auth/login\nStatus: " + response.status + "\nStatus Text: " + response.statusText + "\nData: "+ response.data)
            }).catch(err => {
            if (!err.response) return;
            Swal.fire({
                type: "error",
                title: "Oops...",
                text: `${err.response.status}: ${err.response.data.text}`,
                footer: "<a href='/reset'>Forgot your password?</a>&nbsp;<a href='/signup'>Don't have an account yet?</a>"
            });
        });

        // axios.get('https://localhost:8443/user/test')
        //     .then(response => {
        //         console.log("get returned:")
        //         console.log("response ", response)
        //         console.log("response.data ", response.data)
        //         alert("GET https://localhost:8443/user/test\nStatus: " + response.status + "\nStatus Text: " + response.statusText + "\nData: "+ response.data)
        //     })
                
        //     .catch(error => {
        //         console.log("GET ERROR")
        //         console.log(error)
        //         console.log(error.request.response)
        //         alert("GET https://localhost:8443/user/test\n" + error)
        //      });
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