import React, { Component } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import { Route, Switch, NavLink } from "react-router-dom";
import PostStatistic from "./postsStat";
import UserStatistic from "./usersStat";
import Button from "react-bootstrap/Button";
import Modal from "../Elements/Modal";
import NewAdv from "../NewAdv";
import ReactDOM from "react-dom";

export default class AdminPage extends Component {
	constructor(props){
		super(props);
		this.state ={
			modalOpen : false,
		};

		this.setModal = this.setModal.bind(this);
		this.handleClickNewPost = this.handleClickNewPost.bind(this);
	}

	renderModal() {
		return ReactDOM.createPortal(
			<Modal setModal={this.setModal} modalClasses={["newAdv"]} contentClasses={[]}>
				<NewAdv
					setModal={this.setModal}
				/>
			</Modal>,
			document.body
		);
	}

	setModal(open) {
		this.setState({ modalOpen: open });
	}

	handleClickNewPost() {
		this.setModal(true);
	}

	render() {
		return <div className="admin-page">
			<Jumbotron>
				<h1>Admin page</h1>
				<p>Welcome to the admin page!
					<br/>Here you can find some statistics about your profile and add advertisement.</p>
				<Button onClick={this.handleClickNewPost}>Add advertisement</Button>
			</Jumbotron>
			<div className="mode-buttons">
				<NavLink activeclassname="active" to={"/admin/postsStat"}>Posts</NavLink>
				<NavLink activeclassname="active" to={"/admin/usersStat"}>Users</NavLink>
			</div>
			<Switch>
				<Route path={"/admin/postsStat"} render = {() => (
					<PostStatistic/>
				)}/>
				<Route path={"/admin/usersStat"} render = {() => (
					<UserStatistic/>
				)}/>
			</Switch>
			{this.state.modalOpen && this.renderModal()}
		</div>;
	}

}
