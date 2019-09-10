import React, { Component } from "react"

class ImageThumb extends Component {
	constructor() {
		super()
		this.state = {
			displayX: false,
		}

		this.displayX = this.displayX.bind(this)
		this.hideX = this.hideX.bind(this)
	}

	displayX() {
		this.setState({
			displayX: true,
		})
	}

	hideX() {
		this.setState({
			displayX: false,
		})
	}

	render() {
		return (
			<div className="image-thumb-container" onMouseOver={this.displayX} onMouseLeave={this.hideX}>
				<img id={this.props.id} className="image-thumb" src={this.props.src} alt={this.props.alt} />
				{this.state.displayX ? <span className="remove-image-icon fa fa-remove" onClick={() => this.props.removeImage(this.props.id)}></span> : null}
			</div>
		)
	}
}

export default ImageThumb