import React, { Component } from "react"

class BidPopup extends Component {

	render() {
		return (
			<div className="popup-bid">
				<input
					type="number"
					name="value"
					value={this.props.value}
					data-decimals="2"
					min={this.props.currently}
					step="0.1"
					onChange={this.props.onChange}
				/>
			</div>
		)
	}
}


export default BidPopup