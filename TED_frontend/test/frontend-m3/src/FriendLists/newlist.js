import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import { request } from "../utils";

export default class NewList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: ""
		};
		this.handleClick = this.handleClick.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}
	
	handleChange(event) {
		this.setState({ name: event.target.value });
	}
	
	handleClick() {
		const { name } = this.state;
		if (name.trim() === "") return;
		request.send("POST", "/list", {
			listName: name,
			followersId: []
		}).then(res => {
			if (res.status >= 200 && res.status < 300) this.props.addList(res.data);
		});
	}

	render() {
		return <li className={"list-item new-list"}>
			<InputGroup className="mb-3">
				<FormControl
					placeholder="List Name"
					aria-label="Friendlist Name"
					aria-describedby="basic-addon2"
					onChange={this.handleChange}
				/>
				<InputGroup.Append>
					<Button variant="outline-primary" onClick={this.handleClick}>Create</Button>
				</InputGroup.Append>
			</InputGroup>
		</li>;
	}
}

NewList.propTypes = {
	addList: PropTypes.func.isRequired
};
