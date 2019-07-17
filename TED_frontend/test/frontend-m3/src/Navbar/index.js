import React, { Component } from "react";
import ReactDOM from "react-dom";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { reloadPosts } from "../Redux/actions";
import NewMedia from "../NewMedia";
import UserArea from "./userarea";
import SearchBar from "../Elements/SearchBar";
import Modal from "../Elements/Modal";
import PropTypes from "prop-types";
import NavbarBootstrap from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

// Chatkit Integration
import {ChatManager, TokenProvider} from "@pusher/chatkit-client";
const instanceLocator = "v1:us1:74f281ff-4e67-4e28-9d19-1d9e9bbd5293";
const testToken = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/74f281ff-4e67-4e28-9d19-1d9e9bbd5293/token";
const tokenProvider = new TokenProvider({
	url: testToken
});

const mapStateToProps = state => ({ user: state.user });
const mapDispatchToProps = dispatch => ({
	shouldReloadPosts: should => dispatch(reloadPosts(should))
});

class ConnectedNavbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			active: false,
			query: "",
			modalOpen : false,
			newMessages: false
		};
		
		this.chatManager = null;

		this.searchBar = React.createRef();

		this.prevScrollpos = window.pageYOffset;
		this.navShownAt = window.pageYOffset;

		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.setModal = this.setModal.bind(this);
		this.setTab = this.setTab.bind(this);
		this.handleClickNewPost = this.handleClickNewPost.bind(this);
		this.handleNewPost = this.handleNewPost.bind(this);
		this.updateChat = this.updateChat.bind(this);
	}

	componentDidMount() {
		window.addEventListener("scroll", this.handleScroll);
		window.addEventListener("click", this.handleClick);
		if (this.props.user) return this.connectToChat();
	}

	connectToChat() {
		if (!this.props.user) return;
		this.chatManager = new ChatManager({
			instanceLocator,
			userId: this.props.user.userName,
			tokenProvider
		});
		this.chatManager.connect({
			onRoomUpdated: this.updateChat
		}).then(currentUser => {
			currentUser.rooms.forEach(room => {
				if (room.unreadCount > 0) {
					this.setState({ newMessages: true });
				}
			});
		});
	}
	
	UNSAFE_componentWillReceiveProps(nextProps) {
		if (this.props.user && nextProps.user && nextProps.user.userName !== this.props.user.userName) {
			this.connectToChat();
		}
	}
	
	componentWillUnmount() {
		window.removeEventListener("scroll", this.handleScroll);
		window.removeEventListener("click", this.handleClick);
	}

	isScrollingUp() {
		return window.pageYOffset < this.prevScrollpos;
	}

	handleClickNewPost() {
		this.setModal(true);
	}

	handleScroll() {
		const { user } = this.props;
		if (!user) return;
		const currentScrollPos = window.pageYOffset;
		const navbar = document.querySelector("nav.navbar");
		if (this.isScrollingUp() || this.state.active) {
			navbar.classList.add("show");
			this.navShownAt = currentScrollPos;
		} else if (currentScrollPos > this.navShownAt + 50) {
			navbar.classList.remove("show");
		}
		this.prevScrollpos = currentScrollPos;
	}

	handleClick(event) {
		if (!this.state.active) return;
		const { current: searchBar } = this.searchBar;
		if (searchBar && !searchBar.contains(event.target)) {
			this.handleBlur();
		}
	}

	handleFocus() {
		this.setState({ active: true });
	}

	handleBlur() {
		this.setState({ active: false });
	}

	setTab(active) {
		this.setState( { active });
	}

	setModal(open) {
		this.setState({ modalOpen: open });
	}

	handleNewPost() {
		const isProfilePage = window.location.pathname.split("/profile/").length > 1;
		if (!isProfilePage) return;
		const userName = window.location.pathname.split("/")[2];
		if (userName !== this.props.user.userName) return;
		this.props.shouldReloadPosts(true);
	}
	
	updateChat(room) {
		if (room.unreadCount) return this.setState({ newMessages: room.unreadCount > 0 });
		return this.setState({ newMessages: false });
	}


	renderModal() {
		return ReactDOM.createPortal(
			<Modal setModal={this.setModal} modalClasses={["newMedia"]} contentClasses={[]}>
				<NewMedia
					setModal={this.setModal}
					handleNewPost={this.handleNewPost}
				/>
			</Modal>,
			document.body
		);
	}

	render() {
		const { user } = this.props;
		if (!user) return null;
		const imgPath = user.imgPath || process.env.PUBLIC_URL+"/images/profile-placeholder.png";
		return (
			<NavbarBootstrap className={"show"} expand="md">
				<div className="nav" onFocus={this.handleFocus}>
					<div className="nav-item nav-feed nav-logo">
						<NavLink exact to="/feed">
							<img src={process.env.PUBLIC_URL+"/images/logo_black.svg"} alt={"illusion logo"}/>
						</NavLink>
					</div>
					<NavbarBootstrap.Toggle aria-controls="basic-navbar-nav" />
					<NavbarBootstrap.Collapse>
						<Nav className="mr-auto">
							<SearchBar className="nav-item" forwardRef={this.searchBar} navbarActive={this.state.active}/>
							<div className="navbarIcons">
								<div className="nav-item nav-profile">
									<NavLink exact to={`/profile/${user.userName}`}>
										<img className="avatar" src={imgPath} alt={`${user.userName}'s avatar`}/>
									</NavLink>
								</div>
								{this.props.user.verified && <div className="nav-item nav-addPost" onClick={this.handleClickNewPost}>
									<button>
										<i className="fas fa-plus"/>
									</button>
								</div>}
								<UserArea active={this.state.active} setTab={this.setTab}/>
								<div className={["nav-item", "nav-chat", this.state.newMessages ? "blink" : null].join(" ")}>
									<NavLink onClick={this.updateChat} exact to={"/messages"}>
										<i className={"fas fa-comments"}/>
									</NavLink>
								</div>
								<div className="nav-item nav-logout">
									<NavLink to={"/logout"}>
										<i className="fas fa-sign-out-alt"/>
									</NavLink>
								</div>
								
							</div>
						</Nav>
					</NavbarBootstrap.Collapse>
				</div>
				{this.state.modalOpen && this.renderModal()}
			</NavbarBootstrap>
		);
	}
}

ConnectedNavbar.propTypes = {
	user: PropTypes.object,
	shouldReloadPosts: PropTypes.func.isRequired
};

const Navbar = connect(mapStateToProps, mapDispatchToProps)(ConnectedNavbar);

export default Navbar;
