import React, { Component } from "react"
import { withRouter } from 'react-router'


class Header extends Component {
	constructor() {
		super()
		this.redirectToHome = this.redirectToHome.bind(this)
	}

	redirectToHome() {
		this.props.history.push("/home")
	}

	render() {
		return (
			<div className="title-header">
				<img style={{verticalAlign: "middle"}} src={require("../images/white_hammer_icon_30px.png")} alt="logo" />
				<span className="header-text" onClick={this.redirectToHome}>Bidder</span>
			</div>
		)
	}
	
}

export default withRouter(Header)