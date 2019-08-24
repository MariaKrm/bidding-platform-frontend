import React, { Component } from "react"


class PreviewMenu extends Component {
	render() {
		return (
			<div>
				<button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
				<div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
					<a className="dropdown-item" href="#">Edit Auction</a>
					<a className="dropdown-item" href="#">Delete Auction</a>
				</div>
			</div>
		)
	}
}

export default PreviewMenu