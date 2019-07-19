import React, {Component} from "react"
import AddressItem from "./AddressItem"


class AddressInput extends Component {
	render() {
		return (
			<div>
				<div>
					<AddressItem label="Street" value={this.props.street} placeholder="" readOnly="true" />
					<AddressItem label="City" value={this.props.city} placeholder="" readonly="true" />
					<AddressItem label="State" value={this.props.state} placeholder="" readonly="true" />
					<AddressItem label="Postal Code" value={this.props.code} placeholder="" readonly="true" />
					<AddressItem label="Country" value={this.props.country} placeholder="" readonly="true" />
				</div>
			</div>
		)
	}
}



export default AddressInput