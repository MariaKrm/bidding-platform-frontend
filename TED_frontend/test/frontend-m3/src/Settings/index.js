import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { assignUser } from "../Redux/actions";
import Biography from "./biography.js";
import { Route, Redirect } from "react-router";
import { NavLink } from "react-router-dom";
import SettingsPassword from "./password.js";
import VisibilitySetting from "./visibility";
import NewProPic from "./newProPic.js";
import {request} from "../utils";
import Swal from "sweetalert2";
import ReactDOM from "react-dom";
import Modal from "../Elements/Modal";
import PropTypes from "prop-types";


const mapStateToProps = (state) => ({ user: state.user });
const mapDispatchToProps = (dispatch) => ({
	assignUser: user => dispatch(assignUser(user))
});

class ConnectedSettings extends Component {
	constructor(props) {
		super(props);
		const { user } = props;
		this.state = {
			privateProfile: user.privateProfile,
			bio: user.bio || "",
			media: user.imgPath || null,
			modalOpen: false,
			redirecting: false,
			error: null
		};


		this.updateFields = this.updateFields.bind(this);
		this.handleImageChange = this.handleImageChange.bind(this);
		this.submitData = this.submitData.bind(this);
		this.setModal = this.setModal.bind(this);
		this.handleNewProPic = this.handleNewProPic.bind(this);
		this.handleEmailRequest = this.handleEmailRequest.bind(this);
		this.loadUser = this.loadUser.bind(this);
	}

	componentDidMount() {
		this.loadUser();
	}

	loadUser() {
		request.send("GET", `/user/${this.props.user.userName}`).then(res => res.data).then(user => {
			this.props.assignUser(user);
		});
	}

	handleNewProPic() {
		this.setModal(true);
	}

	setModal(open) {
		this.setState({ modalOpen: open });
	}

	handleEmailRequest(event) {
		event.persist();
		request.send("GET", "/account/resend-verify").then(() => {
			event.target.classList.add("success");
			setTimeout(() => event.target.classList.remove("success"), 5000);
		});
	}

	handleImageChange(media) {
		this.setState({
			media
		});
	}

	updateFields(fields) {
		this.setState(state => Object.assign(state, fields));
	}

	submitData(event) {
		event.preventDefault();
		const changes = {
			privateProfile: this.state.privateProfile,
			bio: this.state.bio,
			media: this.state.media
		};
		const filtered = Object.keys(changes)
			.filter(key => changes[key] !== null && changes[key] !== "")
			.reduce((obj, key) => {
				obj[key] = changes[key];
				return obj;
			}, {});
		const formData = new FormData();
		for (let key in filtered) {
			formData.append(key, filtered[key]);
		}
		let count = 0;
		formData.forEach(() => count++);
		if (!count) return;
		request.send("PUT", "/user/updateDetails", formData, {
			"Content-Type": "multipart/form-data"
		}).then(res => res.data).then(user => {
			let timerInterval;
			this.props.assignUser(user);
			Swal.fire({
				type: "success",
				title: "Profile Updated",
				text: "Your changes have been successfully saved.",
				timer: 2000,
				onClose: () => {
					clearInterval(timerInterval);
					this.setState({ redirecting: true });
					
				}
			});
		}).catch(err => {
			Swal.fire({
				type: "error",
				title: "Oops...",
				text: `${err.response.status}: ${err.response.data.text}`,
			});
		});
	}

	renderModal() {
		return ReactDOM.createPortal(
			<Modal setModal={this.setModal} modalClasses={["newProPic"]} contentClasses={[]}>
				<NewProPic photo={this.state.media} handleImageChange={this.handleImageChange} setModal={this.setModal}/>
			</Modal>,
			document.body
		);
	}

	render() {
		const { user } = this.props;
		return <Fragment>
			{this.state.redirecting && <Redirect to={"/profile"}/>}
			<Route exact path='/settings' render={() => (
				<div className='settings'>
					<div className={"bio setting"}>
						<Biography bio={user.bio} updateFields={this.updateFields}/>
					</div>
					<div className= "left-side">
						<div className={"setting no-padding"}>
							<VisibilitySetting isPrivate={user.privateProfile} updateFields={this.updateFields}/>
						</div>
						{!this.props.user.verified && <div className={"setting no-padding"}>
							<button className="request-btn" onClick={this.handleEmailRequest}>Request verification mail</button>
						</div>}
						{this.props.user.verified && <Fragment>
							<div className={"setting no-padding"}>
								<div>
									<NavLink to={"/lists"}><button>Edit Friend Lists</button></NavLink>
								</div>
							</div>
							<div className={"setting no-padding"}>
								<div>
									<NavLink to={"/blocked"}><button>Edit Blocked Users</button></NavLink>
								</div>
							</div>
							<div className={"setting no-padding"}>
								<div>
									<button onClick={this.handleNewProPic}>Set Profile Picture</button>
								</div>
							</div>
						</Fragment>}
						<div className={"setting no-padding"}>
							{<NavLink exact to="/settings/password">
								<button type="button">
									Change password
								</button>
							</NavLink>
							}
						</div>
						<div className={"setting no-padding"}>
							<button onClick={this.submitData}>Save Changes</button>
						</div>
					</div>
				</div>
			)}/>
			<Route exact path='/settings/password' component={SettingsPassword}/>
			{this.state.modalOpen && this.renderModal()}
			{this.state.error && this.renderError()}
		</Fragment>;
	}
}

const Settings = connect(mapStateToProps, mapDispatchToProps)(ConnectedSettings);

export default Settings;

ConnectedSettings.propTypes = {
	user : PropTypes.shape({
		userName : PropTypes.string,
		verified : PropTypes.bool
	}),
	assignUser : PropTypes.func.isRequired
};
