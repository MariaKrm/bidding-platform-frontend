import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Biography extends Component {
	constructor(props) {
		super(props);

		this.state = {
			bio: props.bio
		};

		this.maxChars = 500;

		this.inputField = React.createRef();

		this.handleChange = this.handleChange.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
	}

	componentDidMount() {
		this.handleBlur();
		const { current: inputField } = this.inputField;
		inputField.innerText = this.props.bio;
	}

	handleFocus() {
		if (this.state.bio === "") {
			const { current: inputField } = this.inputField;
			inputField.innerText = "";
		}
	}

	handleBlur() {
		if (this.state.bio === "") {
			const { current: inputField } = this.inputField;
			inputField.innerText = "Write a new description";
		}
	}

	handleChange(event) {
		const { innerText: bio } = event.target;
		this.setState({ bio });
		this.props.updateFields({ bio });
	}

	render() {
		let { bio } = this.state;
		const className = (bio === "") ? "empty" : "";
		if (!bio) bio = "";
		const errorClass = (bio.length <= this.maxChars) ? "" : "error";
		const counter = this.maxChars - bio.length;
		return (
			<React.Fragment>
				<div className={"biography"}>
					<div className={"header"}>
						<div className="bio-title">
							Biography:
						</div>
						<span className={"chars-left "+errorClass}>{counter}</span>
					</div>
					<div
						ref={this.inputField}
						contentEditable
						className={"bio-text "+[className, errorClass].join(" ")}
						onInput={this.handleChange}
						onFocus={this.handleFocus}
						onBlur={this.handleBlur}
					/>
				</div>
			</React.Fragment>);

	}
}

Biography.propTypes = {
	bio : PropTypes.string,
	updateFields : PropTypes.shape ({
		bio : PropTypes.string
	})
};
