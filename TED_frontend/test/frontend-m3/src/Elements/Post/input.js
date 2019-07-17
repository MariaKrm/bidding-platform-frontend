import React, { Component } from "react";
import { connect } from "react-redux";
import {capitalize, request} from "../../utils";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

const mapStateToProps = (state) => ({ user: state.user});

class ConnectedPostInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			comment: "",
			emptyField: true,
			isBeingUsed: false,
		};
		
		this.input = React.createRef();
		
		this.handleInput = this.handleInput.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
	}

	handleFocus(event) {
		event.preventDefault();
		if (this.state.emptyField) {
			this.input.current.innerText = "";
		}
		this.setState({ isBeingUsed: true });
	}

	handleBlur(event) {
		event.preventDefault();
		const text = event.target.innerText;
		let emptyField = false;
		if (text.trim() === "") {
			this.input.current.innerText = "Write your comment here...";
			emptyField = true;
		}
		this.setState({ comment: text, emptyField });
	}

	handleInput(event) {
		event.preventDefault();
		const text = event.target.innerText;
		this.setState({ comment: text });
	}
	
	handleSubmit(event) {
		const { comment: text } = this.state;
		request.send("POST", `/post/${this.props.post.id}/comment`, {
			content: text
		}).then(res => res.data).then(comment => {
			this.props.handleNewComment(comment);
			event.target.innerText = "";
			event.target.blur();
		}).catch(err => this.renderError(`${err.response.status}: ${capitalize(err.response.data.text)}`));
	}
	
	handleKeyDown(event) {
		if (!event.shiftKey && event.keyCode === 13) {
			event.preventDefault();
			this.handleSubmit(event);
		}
	}

	componentDidMount() {
		const { current: input } = this.input;
		input.innerText = "Write your comment here...";
		input.onkeydown = this.handleKeyDown;
	}

	componentWillUnmount() {
		const { current: input } = this.input;
		input.onkeydown = null;
	}
	
	renderError(text) {
		Swal.fire({
			type: "error",
			title: "Oops...",
			text,
		});
	}

	render() {
		const { user } = this.props;
		const imgPath = user.imgPath || process.env.PUBLIC_URL+"/images/profile-placeholder.png";
		return <div className="input">
			<div><img className="avatar" src={imgPath} alt={`${user.userName}'s avatar`}/></div>
			<div className="text"
				contentEditable={true}
				onInput={this.handleInput}
				onBlur={this.handleBlur}
				onFocus={this.handleFocus}
				ref={this.input}>
			</div>
		</div>;
	}
}

ConnectedPostInput.propTypes = {
	handleNewComment: PropTypes.func,
	user: PropTypes.object,
	post: PropTypes.shape({
		id: PropTypes.number
	})
};

const PostInput = connect(mapStateToProps)(ConnectedPostInput);

export default PostInput;
