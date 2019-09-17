import React, { Component } from "react"


class UploadXML extends Component {
	render() {
		return (
			<div>
				<Header />
				{this.success()}
				<form className="new-auction-form" onSubmit={this.handleSubmit}>
					{this.state.error && this.state.error !== "" && <div className="alert-danger"><strong>{this.state.error}</strong> </div>}
					<label>Add pictures &nbsp;&nbsp;</label> <input type="file" accept="image/*" onChange={this.handleImageUpload}/>
					<button type="submit" className="btn btn-dark btn-margin btn-set-size">Submit</button>
					<button type="button" className="btn btn-danger btn-margin btn-set-size" onClick={this.cancel}>Cancel</button>
				</form>
			</div>
		)
	}
}

export default UploadXML