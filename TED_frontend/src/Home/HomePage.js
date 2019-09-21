import React, { Component } from "react"
import HomeHeader from "../Elements/HomeHeader"
import Navbar from "../Elements/Navbar"
import Feed from "./Feed"


class HomePage extends Component {
	render() {
		return (
			<div>
				<HomeHeader history={this.props.history} />
				<Navbar homeTab="active" />
				<Feed {...this.props} />
			</div>
		)
	}
}

export default HomePage