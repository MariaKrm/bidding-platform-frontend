import React, {Component} from "react"
import AddressInput from "./AddressInput"
import AddressSuggest from "./AddressSuggest"
import axios from "axios"

// https://developer.here.com/blog/street-address-validation-with-reactjs-and-here-geocoder-autocomplete

class AddressForm extends Component {
	constructor(props) {
		super(props)

		const address = this.getEmptyAddress();
    	this.state = {
      		address: address,
      		query: "",
      		locationId: "",
      		coords: {
      			lat: "",
      			lon: ""
      		},
      		isChecked: false,
      		error: "",
    	}

    this.onQuery = this.onQuery.bind(this);
		this.onCheck = this.onCheck.bind(this);
		this.onClear = this.onClear.bind(this);
	}

	getEmptyAddress() {
		return {
			street: "",
			city: "",
			state: "",
			postalCode: "",
			country: ""
		}
	}

	onQuery(event) {
		this.setState( {
			coords: null
		})
		const query = event.target.value
		if(!query.length > 0) {
			const address = this.getEmptyAddress()
			return this.setState({
        		address: address,
        		query: "",
        		locationId: "",
       		})
		}


		axios.get("https://autocomplete.geocoder.api.here.com/6.2/suggest.json", {
			params: {
				app_id: "eI2RzAYqFejuc1XpDqZX",
        		app_code: "bgmyQQmzbygBLLs4erk7dQ",
        		query: query,
        		maxresults: 1,
			}
		}).then(response => {
			const address = response.data.suggestions[0].address;
			const id = response.data.suggestions[0].locationId;
			this.setState({
          		address: address,
          		query: query,
          		locationId: id,
          	})
		})


		this.props.onAddressSubmit(null, null, null)
	}


	onCheck(evt) {
		let params = {
    		app_id: "eI2RzAYqFejuc1XpDqZX",
    		app_code: "bgmyQQmzbygBLLs4erk7dQ"
  		}

  		if(this.state.locationId.length > 0) {
    		params['locationId'] = this.state.locationId;
  		}
  		else {
    		params['searchtext'] = this.state.address.street
      			+ this.state.address.city
      			+ this.state.address.state
      			+ this.state.address.postalCode
      			+ this.state.address.country
  		}

  		axios.get('https://geocoder.api.here.com/6.2/geocode.json',
    		{ params: params }
  		).then(response => {
    		const view = response.data.Response.View
    		if(view.length > 0 && view[0].Result.length > 0 && this.state.address.city && this.state.address.country) {
      			const location = view[0].Result[0].Location;
      			const oldCity = this.state.address.city
      			const oldCountry = this.state.address.country

      			this.setState({
        			isChecked: true,
        			coords: {
            			lat: location.DisplayPosition.Latitude,
            			lon: location.DisplayPosition.Longitude
        			},
        			address: {
          				street: location.Address.HouseNumber + ' ' + location.Address.Street,
          				city: location.Address.City,
          				state: location.Address.State,
          				postalCode: location.Address.PostalCode,
         				country: location.Address.Country
        			},
        			error: ""
        		})

      			console.log("lat: ", this.state.coords.lat)
      			console.log("lon: ", this.state.coords.lon)

      			this.props.onAddressSubmit(this.state.coords, oldCity, oldCountry)

    		}
    		else {
      			this.setState({
        			isChecked: false,
        			coords: null,
        			error: "Please enter a full address"
        		})
    		}
  			
  		})

	}


	onClear() {
		const address = this.getEmptyAddress();
		console.log("coords was: ", this.state.coords)
		console.log("and address was: ", this.state.address)
		console.log("and isChecked: ", this.state.isChecked)
		this.setState({
			address: address,
			query: "",
			locationId: "",
			coords: null,
			isChecked: false,
			error: "",
		})
		this.props.onAddressSubmit(null, null, null)
	}

	render() {
		return (
			<div className="address-form">
				{this.state.error && this.state.error !== "" && <div className="address-error-message">{this.state.error} </div>}
				<AddressSuggest 
					query={this.state.query}
					onChange={this.onQuery}
				/>
				<br />
				<AddressInput
					street={this.state.address.street}
            		city={this.state.address.city}
            		state={this.state.address.state}
            		code={this.state.address.postalCode}
            		country={this.state.address.country}
            	/>
            	<br />
            	<button type="button" className="address-button" onClick={this.onCheck}>Check</button>
          		<button type="button" className="address-button" onClick={this.onClear}>Clear</button>
          	</div>
		)
	}
}


export default AddressForm