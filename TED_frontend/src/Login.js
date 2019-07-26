import React, {Component} from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import Header from "./Header"



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
        var config = {
                headers: {'Access-Control-Allow-Origin': '*'}
            };


        const user = {
            username: this.state.username,
            password: this.state.password
        }
        axios.post('https://localhost:8443/auth/login', {user}, config)
            .then(response => {
                console.log("post returned:")
                console.log("response ", response)
                console.log("response.data ", response.data)
                alert("POST https://localhost:8443/auth/login\nStatus: " + response.status + "\nStatus Text: " + response.statusText + "\nData: "+ response.data)
            })
            
            .catch(error => {
                console.log("POST ERROR")
                console.log(error)
                alert("POST https://localhost:8443/auth/login\n" + error)
            });

            axios.get('https://localhost:8443/user/test', config)
                .then(response => {
                    console.log("get returned:")
                    console.log("response ", response)
                    console.log("response.data ", response.data)
                    alert("GET https://localhost:8443/user/test\nStatus: " + response.status + "\nStatus Text: " + response.statusText + "\nData: "+ response.data)
                })
                
                .catch(error => {
                    console.log("GET ERROR")
                    console.log(error)
                    alert("GET https://localhost:8443/user/test\n" + error)
                });
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