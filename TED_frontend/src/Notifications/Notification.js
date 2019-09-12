import React, { Component } from "react"

class Notification extends Component {
	render() {
		return (
			<div className="notification">
				{this.props.message}
			</div>
		)
	}
}

export default Notification