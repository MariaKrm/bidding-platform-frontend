import React, {Component, Fragment} from "react";
import UploadAndEdit from "../UploadAndEdit";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

class NewProPic extends Component {
	constructor(props) {
		super(props);
		this.state = {
			image: props.photo || null,
			modified : (props.photo !== null)
		};

		this.uploadAndEdit = React.createRef();

		this.setImage = this.setImage.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.handleImageChange = this.handleImageChange.bind(this);
		this.handleModified = this.handleModified.bind(this);
	}

	setImage(image) {
		this.setState({ image });
	}

	closeModal()
	{
		this.props.setModal(false);
	}

	handleModified(value)
	{
		this.setState({modified : value});
	}

	handleImageChange()
	{
		//example, change che arrow function with the one to send it to the backend
		this.uploadAndEdit.current.getImageFromUploaderAndEditor((file) => this.props.handleImageChange(file));
		Swal.fire({
			type: "warning",
			title: "Updated",
			html: "You successfully selected a picture!<br/>Remember to save your changes.",
		});
		this.closeModal();
	}

	render() {
		let saveButton = (this.state.modified? <button className="save-btn" onClick={this.handleImageChange}>SAVE</button> : <React.Fragment></React.Fragment> );
		return (
			<Fragment>
				<div className = "left">
					<div className = "photo-container">
						<UploadAndEdit height={350} width={350} exts={["PNG", "JPEG", "MP4", "WMV", "FLV"]} photo={this.state.image} handleModified={this.handleModified} ref={this.uploadAndEdit} includeBnW={false}/>
					</div>
				</div>
				<div className="action-btn">
					{saveButton}
					<button className="cancel-btn" onClick={this.closeModal}>Cancel</button>
				</div>
			</Fragment>
		);
	}

}

export default NewProPic;

NewProPic.propTypes = {
	photo : PropTypes.object,
	setModal : PropTypes.func.isRequired,
	handleImageChange : PropTypes.func.isRequired
};
