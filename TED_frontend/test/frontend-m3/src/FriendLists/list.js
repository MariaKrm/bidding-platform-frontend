import React, { Component } from "react";
import { request } from "../utils";
import UserResult from "../Elements/UserResult";
import ListAddUser from "./adduser";

import PropTypes from "prop-types";
import Swal from "sweetalert2";

export default class FriendList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			members: [],
		};
		
		this.listHeader = React.createRef();
		
		this.loadMembers = this.loadMembers.bind(this);
		this.handleDeleteList = this.handleDeleteList.bind(this);
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleNewMember = this.handleNewMember.bind(this);
	}
	
	componentDidMount() {
		this.loadMembers();
		const { current: listHeader } = this.listHeader;
		listHeader.innerText = this.props.list.name;
	}
	
	UNSAFE_componentWillReceiveProps(nextProps) {
		const { current: listHeader } = this.listHeader;
		listHeader.innerText = nextProps.list.name;
	}
	
	loadMembers() {
		request.send("GET", "/list/"+this.props.list.listId).then(res => res.data).then(list => {
			this.setState({ members: list.members });
		});
	}
	
	handleDeleteList() {
		if (this.state.members.length === 0) return request.send("DELETE", "/list/"+this.props.list.listId).then(res => {
			if (res.status >= 200 && res.status < 300) {
				Swal.fire(
					"Deleted!",
					`Friendlist ${this.props.list.name} has been deleted.`,
					"success"
				);
				this.props.deleteList(this.props.list.listId);
			}
		});
		Swal.fire({
			title: "Are you sure?",
			html: `${this.props.list.name} contains ${this.renderMembers()}.<br/>You won't be able to revert this!`,
			type: "question",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, delete it!"
		}).then((result) => {
			if (result.value) {
				request.send("DELETE", "/list/"+this.props.list.listId).then(res => {
					if (res.status >= 200 && res.status < 300) {
						Swal.fire(
							"Deleted!",
							`Friendlist ${this.props.list.name} has been deleted.`,
							"success"
						);
						this.props.deleteList(this.props.list.listId);
					}
				});
			}
		});
	}
	
	handleNameChange(event) {
		event.persist();
		if (event.target.innerText === this.props.list.name) return;
		
		if (event.target.innerText.trim() === "") {
			event.target.innerText = this.props.list.name;
		}
		
		request.send("PUT", "/list/"+this.props.list.listId, {
			listName: event.target.innerText,
			followersId: this.state.members.map(x => `${x.id}`)
		}).then(res => res.data).then(list => {
			this.props.modifyList(list);
		}).catch(() => {
			event.target.innerText = this.props.list.name;
		});
	}
	
	handleNewMember(user) {
		this.setState(state => ({
			members: [...state.members, user]
		}));
	}
	
	handleRemoveUser(idx) {
		const members = [...this.state.members];
		members.splice(idx, 1);
		request.send("PUT", "/list/"+this.props.list.listId, {
			followersId: members.map(x => `${x.id}`)
		}).then(res => res.data).then(list => {
			this.setState({members});
			this.props.modifyList(list);
		});
	}
	
	renderMembers() {
		const n = this.state.members.length;
		if (n > 1) return `${n} members`;
		if (n === 0) return "no members";
		return "a member";
	}
	
	render() {
		return <li className={"list-item"}>
			<div className={"header"}><span ref={this.listHeader} onBlur={this.handleNameChange} contentEditable={true}/><i onClick={this.handleDeleteList} className="fas fa-times"/></div>
			<ul className={"members"}>
				{this.state.members.length === 0 && <span>This list is empty.</span>}
				{this.state.members.map((member, i) => (
					<li key={i}>
						<UserResult user={member}/>
						<i onClick={() => this.handleRemoveUser(i)} className="fas fa-times"/>
					</li>
				))}
			</ul>
			<ListAddUser
				list={this.props.list}
				currentMembers={this.state.members}
				handleNewMember={this.handleNewMember}
			/>
			
		</li>;
	}
}

FriendList.propTypes = {
	list: PropTypes.shape({
		listId: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired
	}).isRequired,
	deleteList: PropTypes.func.isRequired,
	modifyList: PropTypes.func.isRequired
};
