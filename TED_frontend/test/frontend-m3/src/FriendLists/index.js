import React, { Component } from "react";
import { request } from "../utils";
import Jumbotron from "react-bootstrap/Jumbotron";
import FriendList from "./list";
import NewList from "./newlist";

export default class FriendLists extends Component {
	constructor(props) {
		super(props);
		this.state = {
			lists: []
		};
		
		this.loadLists = this.loadLists.bind(this);
		this.renderLists = this.renderLists.bind(this);
		this.handleNewList = this.handleNewList.bind(this);
		this.handleDeleteList = this.handleDeleteList.bind(this);
		this.handleModifiedList = this.handleModifiedList.bind(this);
	}
	
	componentDidMount() {
		this.loadLists();
	}
	
	loadLists() {
		request.send("GET", "/list/all").then(res => res.data).then(lists => {
			this.setState({ lists });
		});
	}
	
	renderLists() {
		const lists = [...this.state.lists];
		lists.sort((a,b) => a.listId - b.listId);
		return lists.map((list) => (
			<FriendList
				key={list.listId}
				list={list}
				deleteList={this.handleDeleteList}
				modifyList={this.handleModifiedList}
			/>
		));
	}
	
	handleDeleteList(listId) {
		this.setState(state => ({
			lists: state.lists.filter(list => list.listId !== listId)
		}));
	}
	
	handleNewList(list) {
		list.listId = list.id;
		delete list.id;
		this.setState(state =>({ lists: [...state.lists, list]  }));
	}
	
	handleModifiedList(list) {
		list.listId = list.id;
		delete list.id;
		this.setState(state => ({
			lists: [...state.lists.filter(a => a.listId !== list.listId), list]
		}));
	}
	
	render() {
		return <div className={"friend-lists"}>
			<Jumbotron>
				<h1>Friend Lists</h1>
				<p>Here you can find all your lists of friends</p>
			</Jumbotron>
			<div className={"lists-container"}>
				<ul className={"lists"}>
					{this.renderLists()}
					<NewList addList={this.handleNewList}/>
				</ul>
			</div>
		</div>;
	}
}


