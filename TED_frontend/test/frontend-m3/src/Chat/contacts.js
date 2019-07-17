import React, {Component} from "react";
import { connect } from "react-redux";
import NewChat from "./newchat";
import PropTypes from "prop-types";
import { request } from "../utils";

const mapStateToProps = state => ({
	user: state.user
});


class Contact extends Component {
	constructor(props) {
		super(props);
		this.state = {
			target: null
		};
		
		this.handleClick = this.handleClick.bind(this);
	}
	
	componentDidMount() {
		const type = typeof this.props.targetUser;
		if (type === "string") {
			return this.loadUser();
		}
		if (type === "object") {
			return this.setState({ target: this.props.targetUser });
		}
		throw new Error("Invalid targetUser property passed to Contact component");
	}
	
	handleClick(e) {
		e.preventDefault();
		this.props.setActive(this.props.room.id, this.state.target);
	}
	
	loadUser() {
		request.send("GET", "/user/"+this.props.targetUser)
			.then(res => res.data).then(user => this.setState({ target: user }));
	}
	
	render() {
		if (!this.state.target) return null;
		const imgPath = this.state.target.imgPath || process.env.PUBLIC_URL+"/images/profile-placeholder.png";
		return <li className={this.props.className}>
			<button onClick={this.handleClick}>
				<span className={"contact"}>
					<img alt={`${this.state.target.userName}'s avatar`} src={imgPath}/>
					<span>{this.state.target.userName}</span>
				</span>
				<span>
					{this.props.room.unreadCount > 0 && <span className={"unread-messages"}><span>{this.props.room.unreadCount}</span><i className="fas fa-comment-alt"/></span>}
					<span className={["circle-status", this.props.room.userStore.presenceStore[this.state.target.userName]].join(" ")}/>
				</span>
			</button>
		</li>;
	}
}

Contact.propTypes = {
	room: PropTypes.shape({
		unreadCount: PropTypes.number,
		userStore: PropTypes.object,
		id: PropTypes.string
	}).isRequired,
	targetUser: PropTypes.any.isRequired,
	setActive: PropTypes.func.isRequired,
	className: PropTypes.string
};

class Contacts extends Component {
	handleClick(e, id, target) {
		e.preventDefault();
		this.props.setActive(id, target);
	}
	
	renderContacts() {
		const rooms = Object.values(this.props.rooms);
		rooms.sort((a,b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
		return rooms.map(room => {
			if (!room.customData) return;
			const target = (room.createdByUserId === this.props.user.userName) ? room.customData.target : room.createdByUserId;
			return <Contact
				key={room.id}
				className={this.props.activeChat === room.id ? "active" : null}
				room={room}
				targetUser={target}
				setActive={this.props.setActive}
			/>;
		});
	}
	
	render() {
		return <div className={"contacts"}>
			<NewChat setActive={this.props.setActive} openChat={this.props.openChat}/>
			<ul>
				{Object.values(this.props.rooms).length > 0 ? this.renderContacts() : <div className="no-avaiable"><p>No recent chats available</p></div>}
			</ul>
		</div>;
	}
}

Contacts.propTypes = {
	user: PropTypes.shape({
		userName: PropTypes.string
	}).isRequired,
	rooms: PropTypes.arrayOf(PropTypes.object),
	setActive: PropTypes.func.isRequired,
	activeChat: PropTypes.string,
	openChat: PropTypes.func.isRequired
};


export default connect(mapStateToProps)(Contacts);
