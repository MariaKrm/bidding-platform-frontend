import React, { Component } from "react";
import PropTypes from "prop-types";

export default class SendMessageForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			message: "",
			attachment: null
		};
		
		this.attach = React.createRef();
		
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleFileInput = this.handleFileInput.bind(this);
	}
	
	sendMessage(text) {
		if (text.trim() === "" && !this.state.attachment) return;
		const options = Object.assign({ roomId: this.props.roomId }, this.state.attachment ? {
			parts: [
				{
					type: "text/plain",
					content: text.length > 1 ? text : " "
				},
				{
					file: this.state.attachment
				}
			]
		} : {
			parts: [{
				type: "text/plain",
				content: text
			}]
		});
		if (this.props.scrollDownChat) this.props.scrollDownChat();
		this.props.currentUser.sendMultipartMessage(options);
		this.setState({ attachment: null });
	}
	
	
	handleChange(e) {
		this.props.currentUser.isTypingIn({ roomId: this.props.roomId });
		this.setState({
			message: e.target.value
		});
	}
	
	handleSubmit(e) {
		e.preventDefault();
		this.sendMessage(this.state.message);
		this.setState({
			message: ""
		});
	}
	
	handleFileInput() {
		this.setState({ attachment: this.attach.current.files[0] });
	}
	
	render() {
		return (
			<form
				onSubmit={this.handleSubmit}
				className="send-message-form">
				<input
					onChange={this.handleChange}
					value={this.state.message}
					placeholder="Type your message and hit ENTER"
					type="text" />
				<label className={this.state.attachment ? "selected" : null} onClick={() => this.attach.current.click()} htmlFor="attachment">
					<i className="fas fa-paperclip"/>
				</label>
				<input
					name={"attachment"}
					ref={this.attach}
					type="file"
					onInput={this.handleFileInput}
					accept={"image/jpeg,image/png,image/gif,video/mp4,video/x-flv,video/3gpp,video/x-ms-wmv"}
				/>
			</form>
		);
	}
}

SendMessageForm.propTypes = {
	currentUser: PropTypes.object.isRequired,
	roomId: PropTypes.string.isRequired,
	scrollDownChat: PropTypes.func
};
