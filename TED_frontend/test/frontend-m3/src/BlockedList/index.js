import React, { Component } from "react";
import { request } from "../utils";
import Jumbotron from "react-bootstrap/Jumbotron";
import UserResult from "../Elements/UserResult";
import BlockUserButton from "../Elements/Block";

export default class BlockedList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			blocked: []
		};
		
		this.loadBlocked = this.loadBlocked.bind(this);
	}
	
	componentDidMount() {
		this.loadBlocked();
	}
	
	loadBlocked() {
		request.send("GET", "/user/blocked").then(res => res.data).then(blocked => {
			this.setState({ blocked });
		});
	}
	
	renderBlockedUsers() {
		return this.state.blocked.map(user => <li key={user.id}>
			<UserResult onClick={(event) => event.preventDefault()} user={user}/>
			<BlockUserButton user={user} onClick={this.loadBlocked}/>
		</li>);
	}
	
	render() {
		return <div className={"blocked-lists"}>
			<Jumbotron>
				<h1>Blocked List</h1>
				<p>Here you can find all the users that you&apos;ve currently blocked.<br/>You are not able to see them and neither are they able to see you.</p>
			</Jumbotron>
			<ul>
				{this.state.blocked.length > 0 ? this.renderBlockedUsers() : <li className={"empty"}>No users are currently blocked</li>}
			</ul>
		</div>;
	}
}


