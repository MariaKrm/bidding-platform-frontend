import React, { Component } from "react"


class Timer extends Component {
	constructor() {
		super()
		const dateNow = new Date().toTimeString()
		this.state = {
			date: dateNow
		}
	}


	componentDidMount() {
		setInterval(() => {
			const dateNow = new Date().toTimeString()
			this.setState({
				date: dateNow
			})
		}, 3000)
	}

	render() {
		return(
			<p>{this.state.date}</p>
		)
	}
}


export default Timer