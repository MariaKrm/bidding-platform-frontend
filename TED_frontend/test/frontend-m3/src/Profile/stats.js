import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import Modal from "../Elements/Modal";
import UserResult from "../Elements/UserResult";
import {request} from "../utils";
import PropTypes from "prop-types";

function Container(props) {
	return <Fragment>
		<div className={"header"}>{props.header}</div>
		<div className={"container"}>
			{props.children}
		</div>
	</Fragment>;
}

Container.propTypes = {
	header : PropTypes.string,
	children : PropTypes.element
};

class Statistic extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalOpen: false,
			list: []
		};

		this.setModal = this.setModal.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.renderContainer = this.renderContainer.bind(this);
		this.loadList = this.loadList.bind(this);
	}

	setModal(open) {
		this.setState({ modalOpen: open });
	}

	loadList(callback) {
		if (!this.props.user) return;
		const query = [`/user/getFollowers/${this.props.user.userName}`, `/user/getFollowing/${this.props.user.userName}`][this.props.type];
		request.send("GET", query).then(res => res.data).then(list => {
			this.setState({ list });
			callback();
		});
	}

	handleClick() {
		this.loadList(() => this.setModal(true));
	}

	renderList() {
		const { list } = this.state;
		if (list.length === 0) return this.setModal(false);
		return list.map((user, i) => (
			<UserResult
				user={user.userName}
				key={i}
				setModal={this.setModal}
				handleFollow={this.props.handleFollow}
				followAllowed={true}
			/>));
	}

	renderContainer() {
		return <Container header={this.props.label}>
			{this.renderList()}
		</Container>;
	}

	renderModal() {
		return ReactDOM.createPortal(
			<Modal setModal={this.setModal} modalClasses={[]} contentClasses={["likes"]}>
				{this.renderContainer()}
			</Modal>,
			document.body);
	}

	render() {
		return <div className={"stat"} onClick={this.handleClick}>
			{this.props.label}
			<span>{this.props.count}</span>
			{this.state.modalOpen && this.renderModal()}
		</div>;
	}
}

Statistic.propTypes = {
	user : PropTypes.shape({
		userName: PropTypes.string
	}),
	handleFollow : PropTypes.func.isRequired,
	label : PropTypes.string,
	count : PropTypes.number,
	type : PropTypes.number
};

export default class Statistics extends Component {

	render() {
		const { displayUser } = this.props;
		const { nPosts, nFollowers, nFollowings } = displayUser;
		return (<div className='statistics'>
			<Statistic
				label={"Followers"}
				count={nFollowers}
				user={displayUser}
				type={0}
				handleFollow={this.props.handleFollow}
			/>
			<Statistic
				label={"Following"}
				count={nFollowings}
				user={displayUser}
				type={1}
				handleFollow={this.props.handleFollow}
			/>
			<div className={"stat"}>Posts <span>{nPosts}</span></div>
		</div>);
	}
}

Statistics.propTypes = {
	handleFollow : PropTypes.func.isRequired,
	displayUser : PropTypes.shape({
		nPosts : PropTypes.number,
		nFollowers : PropTypes.number,
		nFollowings : PropTypes.number
	})
};
