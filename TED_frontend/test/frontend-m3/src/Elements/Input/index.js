import {Component} from "react";
import React from "react";
import PropTypes from "prop-types";


export default class InputElement extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: "",
			active: false,
		};
		
		this.input = React.createRef();
		
		this.handleChange = this.handleChange.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}
	
 
	handleFocus() {
		this.setState({ active: true});
	}
 
	handleBlur() {
		this.setState({ active: false});
	}
 
	handleChange(event) {
		const {value} = event.target;
		this.setState({value});
		this.props.onChange(this.props.name, value);
	}
 
	handleClick() {
		const { current: input } = this.input;
		input.focus();
	}
 
	render() {
		const activeClass = (this.state.active) ? "active" : "";
		return <div className={"field "+activeClass} onFocus={this.handleFocus} onBlur={this.handleBlur} onClick={this.handleClick}>
			<div className="input">
				<label>{this.props.label}:</label>
				<input
					ref={this.input}
					type={this.props.type}
					name={this.props.name}
					placeholder={this.props.placeholder}
					onChange={this.handleChange}
				/>
			</div>
		</div>;
	}
}

InputElement.propTypes = {
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	type: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	onChange: PropTypes.func.isRequired
};
