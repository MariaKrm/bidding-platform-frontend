import React, {Component} from "react"
import "../style.css"


class AddressItem extends Component {
	render() {
		return (
			<div>
				<label>{this.props.label}</label>
				<div>
					<input
						type="text"
						defaultValue={this.props.value}
						onChange={this.props.onChange}
						placeholder={this.props.placeholder}
					/>
				</div>
			</div>
		)
	}
}


export default AddressItem