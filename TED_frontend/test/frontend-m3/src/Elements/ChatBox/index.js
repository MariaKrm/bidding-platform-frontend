import React, { Component, Fragment } from "react";
import MessageList from "./messages";
import SendMessage from "./input";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { request } from "../../utils";

const mapStateToProps = state => ({
	user: state.user
});

class ChatBox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			messages: [],
			userTarget: null,
			userTyping: false
		};
		
		this.chatbox = React.createRef();
		this.timer = null;
		this.scrollDownChat = this.scrollDownChat.bind(this);
	}
	
	componentDidUpdate() {
		if (this.timer) {
			clearTimeout(this.timer);
		}
		this.timer = setTimeout(this.scrollDownChat, 300);
	}
	
	UNSAFE_componentWillReceiveProps(nextProps) {
		if (!nextProps.room) return;
		if (!this.props.room || nextProps.room.id !== this.props.room.id) {
			this.setState({
				room: nextProps.room,
				messages: []
			});
			
			if (this.props.target !== nextProps.target) {
				request.send("GET", "/user/"+nextProps.target).then(res => res.data).then(user => {
					this.setState({ userTarget: user });
				});
			}
			

			if (nextProps.currentUser && nextProps.room) {
				nextProps.currentUser.subscribeToRoomMultipart({
					roomId: nextProps.room.id,
					hooks: {
						onPresenceChanged: (state,user) => this.props.handlePresence(state,user, nextProps.room),
						onMessage: message => {
							if (message.room.id !== this.props.room.id) return;
							this.setState(state => ({
								messages: [...state.messages, message]
							}));
						},
						onUserStartedTyping: () => {
							this.setState({ userTyping: true });
						},
						onUserStoppedTyping: () => {
							this.setState( { userTyping: false });
						},
					}
				});
			}
		}
	}

	
	parseMessages() {
		const messages = [].concat(this.state.messages);
		if (!this.state.messages) return [];
		const result = [];
		let i = 0;
		messages.forEach((message,j) => {
			if (!messages[j-1]) return result.push([message]);
			const timeDelta = new Date(message.createdAt) - new Date(messages[j-1].createdAt);
			if (messages[j-1].senderId === message.senderId && timeDelta < 30000) {
				return result[i].push(message);
			}
			result.push([message]);
			i++;
		});
		return result;
	}
	
	scrollDownChat() {
		const { current: chatbox } = this.chatbox;
		chatbox.scrollTop = chatbox.scrollHeight;
	}

	render() {
		return <div className={"chat"}>
			<div className={"spinner"} style={{
				display: "flex",
				justifyContent: "center"
			}}>
			</div>
			{this.props.room && <Fragment>
				<MessageList forwardRef={this.chatbox} room={this.props.room} currentUser={this.props.currentUser} userTarget={this.state.userTarget} messages={this.parseMessages()} userTyping={this.state.userTyping}/>
				<SendMessage roomId={this.props.room.id} currentUser={this.props.currentUser} scrollDownChat={this.scrollDownChat}/>
			</Fragment>}
			{!this.props.room && <div className={"empty-chat"}>
				<h3>Please select a chat to start messaging</h3>
			</div>}
		</div>;
	}
}

ChatBox.propTypes = {
	user: PropTypes.shape({
		userName: PropTypes.string
	}).isRequired,
	currentUser: PropTypes.object.isRequired,
	handlePresence: PropTypes.func.isRequired,
	room: PropTypes.object,
	target: PropTypes.string
};

export default connect(mapStateToProps)(ChatBox);
