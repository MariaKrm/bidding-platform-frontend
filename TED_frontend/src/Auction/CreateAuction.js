import React, { Component } from "react"
import Header from "../Elements/Header"
import Swal from "sweetalert2"
import DatePicker from "react-datepicker"
import addMinutes from "date-fns/addMinutes"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import ValidatedInput from "../Elements/ValidatedInput"
import AddressForm from "../Address/AddressForm"
import NotAvailable from "../utils/NotAvailable"
import DropdownContainer from "../Elements/DropdownContainer"
import ImageThumb from "../Elements/ImageThumb"


class CreateAuction extends Component {
	constructor() {
		super()
		this.state = {
			itemName: "",
			buyPrice: "",
			firstBid: "",
			endsAt: "",
			coords: null,
			locationTitle: "",
			description: "",
            images: [],
            imageURLs: [],
			error: "",
			category: "",
			initialCategories: [],
            transformedCategories: null,
			success: false,
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleSelectChange = this.handleSelectChange.bind(this)
		this.handleDateChange = this.handleDateChange.bind(this)
        this.handleImageUpload = this.handleImageUpload.bind(this)
        this.removeImage = this.removeImage.bind(this)
		this.passresult = this.passresult.bind(this)
        this.tranformCategoriesToTreeSelect = this.tranformCategoriesToTreeSelect.bind(this)
		this.getAllCategories = this.getAllCategories.bind(this)
		this.handleAddressSubmit = this.handleAddressSubmit.bind(this)
		this.cancel = this.cancel.bind(this)
		this.verifySubmit = this.verifySubmit.bind(this)
		this.submitAuction = this.submitAuction.bind(this)
	}

	handleChange(event) {
    	const {name, value} = event.target
    	this.setState({ [name]: value })
    }

    handleSelectChange(currentNode, selectedNodes) {
        if(selectedNodes[0]) {
            this.setState({
                category: selectedNodes[0].value,
            })
        }
        else {
            this.setState({
                category: "",
            })
        }
    }

    handleDateChange(date) {
    	this.setState({
    		endsAt: date
    	})
    }

    handleImageUpload(event) {
        //Only allow images
        if(!event.target.files[0].type.includes("image")) {
            return false
        }
        const image = event.target.files[0]
        //Create URL for the preview
        const imageURL = URL.createObjectURL(event.target.files[0])
        this.setState({
            images: this.state.images.concat(image),
            imageURLs: this.state.imageURLs.concat(imageURL),
        })
    }

    removeImage(id) {
        let images = this.state.images
        let imageURLs = this.state.imageURLs
        images.splice(id, 1)
        imageURLs.splice(id, 1)
        this.setState({
            images: images,
            imageURLs: imageURLs,
        })

    }

    //Called on onChange events of ValidatedInput fields
    passresult(name, value, error) {
        //Only keep the value if there are no errors
    	if(error !== null) {
    		value = ""
    	}
    	this.setState({
    		[name]: value,
    	})
    }

    handleAddressSubmit(addressCoords, city, country) {
    	this.setState({
    		coords: addressCoords,
    		locationTitle: city + ", " + country
    	})
    }

    //Transform the categories to the correct form for DropDownTreeSelect (in DropDownContainer)
    tranformCategoriesToTreeSelect(categories) {
        let transCategories = categories.map(cat => {
            return ({
                label: cat.name,
                value: cat.id,
                children: this.tranformCategoriesToTreeSelect(cat.subcategories)
            })
        })

        return transCategories
    }


    //Get all categories to display on dropdown
    getAllCategories() {
    	customRequest("GET", "/item/allCategories")
    	.then(response => {
    		const categories = response.data
    		this.setState({
    			initialCategories: categories,
    		})
            let transCat = this.tranformCategoriesToTreeSelect([categories])
            this.setState({
                transformedCategories: transCat,
            })
    	}).catch(err => {
    		displayError(err)
    	})
    }


    handleSubmit(event) {
    	event.preventDefault()
    	let errorMessage = ""


    	if(this.state.coords === null) {
    		errorMessage = "You have to enter a valid address."
    	}

        if(this.state.category === "") {
            errorMessage = "Please choose a category."
        }

    	const errors = this.state.name === null || this.state.firstBid === null
    	if(errors) {
    		errorMessage = "Please fix the mistakes first."
    	}
    	
    	this.setState({
    		error: errorMessage
    	})

        //Do not allow submit if there are errors
    	if(errorMessage) {
            window.scrollTo(0, 0)   //Scroll to the top so the user sees the error message
            return false
        }

    	const javaDate = this.state.endsAt.toISOString()

    	const newAuction = {
    		name: this.state.itemName,
    		buyPrice: this.state.buyPrice,
    		firstBid: this.state.firstBid,
    		endsAt: javaDate,
    		longitude: this.state.coords.lon,
            latitude: this.state.coords.lat,
    		locationTitle: this.state.locationTitle,
    		categoryId: this.state.category,
    		description: this.state.description,
    	}


        //Send auction in formData, add every field of newAuction
        const formData = new FormData()
        Object.keys(newAuction).forEach(key => {
            formData.append(key, newAuction[key])
        })

        //Add every image as "media"
        this.state.images.forEach(img => {
            formData.append('media', img)
        })

    	this.verifySubmit(formData)
    }


    verifySubmit(newAuction) {
    	Swal.fire({
    		title: 'Are you sure?',
    		text: "Publish New Auction?",
    		type: 'warning',
    		showCancelButton: true,
    		confirmButtonColor: '#3085d6',
    	 	cancelButtonColor: '#d33',
    		confirmButtonText: 'Start Auction'
    	}).then(result => {
    		if(result.value) {
    			setTimeout(() => this.submitAuction(newAuction), 300)
    		}
    	})
    }


    submitAuction(newAuction) {
    	customRequest("POST", "/item", newAuction)
    	.then(response => {
    		this.setState({
    			success: true,
    		})
    		window.scrollTo(0, 0)
    		setTimeout(() => this.props.history.goBack(), 2000)
    	}).catch(err => {
    		displayError(err)
    	})
    }


    cancel() {
    	this.props.history.goBack()
    }


    //Success banner
    success() {
    	if(this.state.success) {
    		return (
    			<div className="alert alert-success">
    			  <strong>Success!</strong> Auction Created. Redirecting...
    			</div>
    		)
    	}
    }

    componentDidMount() {
    	this.getAllCategories()
    }


	render() {
        if(!AuthHelper.loggedIn()) {
            return <NotAvailable />
        }

        if(this.state.transformedCategories === null) {
            return (
                <div>Loading...</div>
            )
        }

        const images = this.state.imageURLs.map((img, index) => {
            return (
                <ImageThumb key={index} id={index} image={img} alt={this.state.name} removeImage={this.removeImage} />
            )
        })

		return (
			<div>
				<Header />
				{this.success()}
				<div className="new-auction-form-group">
					<form className="new-auction-form" onSubmit={this.handleSubmit}>
						{this.state.error && this.state.error !== "" && <div className="alert-danger"><strong>{this.state.error}</strong> </div>}
						<div className="new-auction-fields">
							<ValidatedInput 
								type="text" 
								value={this.state.itemName} 
								name="itemName"
								placeholder="Item Name"
								passresult={this.passresult}
								required
							/>
							<ValidatedInput
								type="text" 
								value={this.state.buyPrice} 
								name="buyPrice" 
								placeholder="Buy Price (ex. 12.00) $"
								passresult={this.passresult}
							/>
							<ValidatedInput
								type="text" 
								value={this.state.firstBid} 
								name="firstBid" 
								placeholder="First Bid"
								passresult={this.passresult}
								required
							/>

							<br />
							<div className="date-picker-container">
								<h4 className="field-label">Auction will end at:</h4>
								<DatePicker
									className="date-picker-field"
									selected={this.state.endsAt}
									onChange={this.handleDateChange}
									showTimeSelect
									timeFormat="HH:mm"
									timeIntervals={15}
									minDate={addMinutes(new Date(), 10)}
									dateFormat="MMMM d, yyyy h:mm aa"
                                    required
								/>
							</div>
                            
                            <br />
                            <div>
                                <h4 className="field-label">Pick a category</h4>
                                <DropdownContainer data={this.state.transformedCategories[0]} mode="radioSelect" onChange={this.handleSelectChange} required />
                            </div>

                            <br />
                            <label>Add pictures &nbsp;&nbsp;</label> <input type="file" accept="image/*" onChange={this.handleImageUpload}/>
                            {images}

                            <br />
							<div className="description-container">
								<h4 className="field-label">Write a short description of the item</h4>
								<textarea name="description" className="description-input" value={this.state.description} onChange={this.handleChange} cols={40} rows={3} required />
							</div>
						</div>
						<button type="submit" className="btn btn-dark btn-margin btn-set-size">Submit</button>
						<button type="button" className="btn btn-danger btn-margin btn-set-size" onClick={this.cancel}>Cancel</button>
					</form>
					<AddressForm onAddressSubmit={this.handleAddressSubmit} />
				</div>
			</div>
		)
	}
}


export default CreateAuction