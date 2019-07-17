import React, {Component} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import {capitalize, request} from "../../utils";
import Swal from "sweetalert2";

const StyledButton = styled.button`
	background: transparent
	border: 1px solid #111
	outline: 0
	padding: 0.25rem 0.5rem
	border-radius: 0.25rem
	text-transform: uppercase
	transition: 0.2s ease-in-out

	&:hover {
		cursor: pointer
		background: #111
		color: white
	}
`;


export default class BlockUserButton extends Component {
	constructor(props) {
		super(props);
		this.state = {
			blocked: false,
		};
		this.checkBlocked = this.checkBlocked.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.confirmBlock = this.confirmBlock.bind(this);
	}
	
	
	componentDidMount() {
		this.checkBlocked();
	}
	
	checkBlocked() {
		request.send("GET", "/user/blocked").then(res => res.data).then(blockedList => {
			const blocked = blockedList.findIndex(user => user.id === this.props.user.id) !== -1;
			this.setState({ blocked });
		});
	}
	
	confirmBlock() {
		const command = (this.state.blocked) ? "unblock" : "block";
		return request.send("PATCH", `/user/${command}/${this.props.user.id}`).then(() => {
			this.setState(state => ({ blocked: !state.blocked }));
			const state = this.state.blocked ? "blocked" : "unblocked";
			Swal.fire({
				title: `${capitalize(state)}!`,
				text: `This user has been ${state}.`,
				type: "success",
				onClose: () => {
					if(this.props.onClick) this.props.onClick();
				}
			
			});
		});
	}
	
	handleClick() {
		if (!this.state.blocked) return Swal.fire({
			title: "Are you sure?",
			text: "You will unfollow this user and you won't be able to see each other until you unblock the user.",
			type: "question",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, proceed!"
		}).then((result) => {
			if (result.value) {
				return this.confirmBlock();
			}
		});
		this.confirmBlock();
	}
	//
	// handleModalClosed() {
	// 	this.setState({ showModal: false });
	// }
	//
	// renderModal() {
	// 	return <Modal show={this.state.showModal} onHide={this.handleModalClosed}>
	// 		<Modal.Header closeButton>
	// 			<Modal.Title>Confirmation Required</Modal.Title>
	// 		</Modal.Header>
	//
	// 		<Modal.Body>
	// 			<p>You are about to block <b>{this.props.user.userName}</b>.
	// 				<br/>
	// 				<br/>
	// 				{this.props.user.followed ?
	// 					<Fragment>You are currently following this user.<br/>This action will cancel your follow subscription.</Fragment> : <Fragment>You are not following this user.</Fragment>}
	// 				<br/>
	// 				<br/>
	// 				Are you sure you want to continue?</p>
	// 		</Modal.Body>
	//
	// 		<Modal.Footer>
	// 			<Button variant="secondary" onClick={this.handleModalClosed}>Cancel</Button>
	// 			<Button variant="primary" onClick={this.confirmBlock}>Confirm</Button>
	// 		</Modal.Footer>
	// 	</Modal>;
	// }
	
	render() {
		return <StyledButton className="block-btn" onClick={this.handleClick}>{(this.state.blocked) ? "Unblock" : "Block"}</StyledButton>;
	}
}

BlockUserButton.propTypes = {
	user: PropTypes.object.isRequired,
	onClick: PropTypes.func
};
