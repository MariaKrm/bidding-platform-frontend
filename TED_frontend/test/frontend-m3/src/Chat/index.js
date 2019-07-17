import React, { Component } from "react";
import ChatBox from "../Elements/ChatBox";
import Contacts from "./contacts";
import { connect } from "react-redux";
import {ChatManager, TokenProvider} from "@pusher/chatkit-client";
import Swal from "sweetalert2";
import { request } from "../utils";

import PropTypes from "prop-types";

const instanceLocator = "v1:us1:74f281ff-4e67-4e28-9d19-1d9e9bbd5293";
const testToken = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/74f281ff-4e67-4e28-9d19-1d9e9bbd5293/token";

const tokenProvider = new TokenProvider({
	url: testToken
});

const mapStateToProps = state => ({
	user: state.user
});

class ChatPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeChat: null,
			rooms: []
		};
		
		this.chatManager = null;
		this.currentUser = null;
		
		this.setActiveChat = this.setActiveChat.bind(this);
		this.addRoom = this.addRoom.bind(this);
		this.updateRoom = this.updateRoom.bind(this);
		this.handlePresence = this.handlePresence.bind(this);
		this.openChat = this.openChat.bind(this);
	}
	
	componentDidMount() {
		const { userName: targetUserName } = this.props.match.params;
		const {userName} = this.props.user;
		
		this.chatManager = new ChatManager({
			instanceLocator,
			userId: userName,
			tokenProvider
		});
		this.chatManager.connect({
			onAddedToRoom: this.addRoom,
			onRoomUpdated: this.updateRoom,
		}).then(currentUser => {
			this.currentUser = currentUser;
			let targetRoom;
			let count = 0;
			
			const targetRoomCB = () => {
				if (count !== this.currentUser.rooms.length) return;
				this.setState({ rooms: currentUser.rooms }, () => {
					if (!targetRoom && targetUserName) {
						this.openChat(targetUserName);
					} else if (targetRoom && targetUserName) {
						this.setActiveChat(targetRoom.id, targetUserName);
					}
				});
				

			};
			
			this.currentUser.rooms.forEach(room => {
				this.currentUser.subscribeToRoomMultipart({
					roomId: room.id,
					hooks: {
						onPresenceChanged: (state, user) => this.handlePresence(state,user, room)
					}
				}).then(() => {
					count++;
					if (room.userIds.includes(targetUserName)) {
						targetRoom = room;
					}
				}).then(targetRoomCB);
			});
		}).catch(err => {
			Swal.fire({
				type: "error",
				title: `${err.response.status}: ${err.response.statusText}`,
				text: "We encountered an issue whilst trying to access your messages",
				timer: 2500
			}).then(() => {
				this.props.history.goBack();
			});
		});
	}
	
	handlePresence(state, user, room) {
		const rooms = [].concat(this.state.rooms);
		const idx = rooms.findIndex(r => r.id === room.id);
		rooms[idx] = room;
		this.setState({ rooms });
	}
	
	getRoom(id) {
		for (let i = 0; i < this.state.rooms.length; i++) {
			if (this.state.rooms[i].id === id) {
				return this.state.rooms[i];
			}
		}
	}
	
	addRoom(room) {
		const rooms = [].concat(this.state.rooms);
		for (let i = 0; i < rooms.length; i++) {
			if (rooms[i].id === room.id) return;
		}
		rooms.push(room);
		this.setState({ rooms });
	}
	
	updateRoom(room) {
		const rooms = [].concat(this.state.rooms);
		for (let i = 0; i < rooms.length; i++) {
			if (rooms[i].id === room.id) {
				rooms[i] = room;
			}
		}
		this.setState({ rooms });
	}
	
	componentWillUnmount() {
		this.chatManager.disconnect();
	}
	
	setActiveChat(id, target) {
		this.setState({ activeChat: id });
		if (typeof target === "object") {
			this.props.history.push("/messages/"+target.userName);
		} else if (typeof target === "string") {
			this.props.history.push("/messages/"+target);
		}
	}
	
	
	createRoom(user, token) {
		return request.send("POST", "https://us1.pusherplatform.io/services/chatkit/v4/74f281ff-4e67-4e28-9d19-1d9e9bbd5293/rooms", {
			creatorId: this.props.user.userName,
			name: (this.props.user.id < user.id) ? `${this.props.user.id}${user.id}` : `${user.id}${this.props.user.id}`,
			private: true,
			user_ids: [this.props.user.userName, user.userName],
			custom_data: {
				target: user.userName
			}
		}, {
			Authorization: "Bearer "+token
		}).then(res => res.data);
	}
	
	openChat(user) {
		let token;
		const { userName } = user;
		return request.send("GET", "/user/"+userName).then(() => {
			return request.send("GET", "/auth/chatkitToken");
		}).then(res => res.data.token).then(data => {
			token = data;
			return request.send("GET", `https://us1.pusherplatform.io/services/chatkit/v4/74f281ff-4e67-4e28-9d19-1d9e9bbd5293/users/${this.props.user.userName}/rooms`, null, {
				Authorization: "Bearer "+token
			});
		}).then(res => res.data).then(rooms => {
			const room = rooms.find(room => {
				return room.member_user_ids.includes(this.props.user.userName) && room.member_user_ids.includes(user.userName);
			});
			return room ? room : this.createRoom(user, token);
		}).then(room => {
			this.setActiveChat(room.id, userName);
			return room;
		}).catch(() => {
			this.props.history.push("/messages");
		});
		
		
	}
	
	render() {
		const room = this.getRoom(this.state.activeChat);
		const userTarget = (room) ? ((room.createdByUserId === this.props.user.userName) ? room.customData.target : room.createdByUserId) : null;
		return <div className={"chat-page"}>
			<Contacts setActive={this.setActiveChat} activeChat={this.state.activeChat} rooms={this.state.rooms} openChat={this.openChat}/>
			{this.currentUser && <ChatBox room={room} currentUser={this.currentUser} target={userTarget} handlePresence={this.handlePresence}/>}
		</div>;
	}
}

ChatPage.propTypes = {
	user: PropTypes.shape({
		userName: PropTypes.string,
		id: PropTypes.string
	}).isRequired,
	history: PropTypes.object,
	match: PropTypes.object
};

export default connect(mapStateToProps)(ChatPage);
