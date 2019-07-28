import React, {Component} from "react"
import AddressItem from "./AddressItem"


class AddressInput extends Component {
	render() {
		return (
			<div>
				<div>
					<AddressItem label="Street" value={this.props.street} placeholder="" readOnly="true" />
					<AddressItem label="City" value={this.props.city} placeholder="" readOnly="true" />
					<AddressItem label="State" value={this.props.state} placeholder="" readOnly="true" />
					<AddressItem label="Postal Code" value={this.props.code} placeholder="" readOnly="true" />
					<AddressItem label="Country" value={this.props.country} placeholder="" readOnly="true" />
				</div>
			</div>
		)
	}
}



export default AddressInput