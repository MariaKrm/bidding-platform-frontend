import React from "react"

class UserPage extends React.Component {
	render() {
		return (
			<h1>User with id: {this.props.match.params.id}</h1>
		)
	}
}

export default UserPage