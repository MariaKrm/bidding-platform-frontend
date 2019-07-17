import React, { Component } from "react";
import { request } from "../utils";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const mapStateToProps = state => ({
	user: state.user
});

class UpdatingPopover extends Component {
	componentDidUpdate(prevProps) {
		if (prevProps.children !== this.props.children) {
			this.props.scheduleUpdate();
		}
	}
	
	render() {
		return <Popover {...this.props} />;
	}
}

UpdatingPopover.propTypes = {
	children: PropTypes.arrayOf(PropTypes.element),
	scheduleUpdate: PropTypes.func
};


class NewChat extends Component {
	constructor(props) {
		super(props);
		this.state = {
			query: "",
			results: [],
			showResults: false
		};
		
		this.timer = null;
		this.delay = 250;
		
		this.inputBox = React.createRef();
		
		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.closeResults = this.closeResults.bind(this);
		
	}
	
	handleSubmit(event) {
		event.preventDefault();
	}
	
	clearInput() {
		const { current: inputBox } = this.inputBox;
		inputBox.value = "";
	}
	
	handleChange(event) {
		if (event) this.setState({ query: event.target.value }, () => {
			if (this.state.query.trim() === "") return this.setState({ showResults: false });
			if (this.timer) {
				clearTimeout(this.timer);
			}
			this.timer = setTimeout(() => {
				if (this.state.query.trim() !== "") {
					request.send("GET", "/user/search?name="+this.state.query.trim()).then(res => res.data).then(results => {
						this.setState({ results, showResults: true, });
					});
				}
			}, this.delay);
		});
	}
	
	handleClick(e, result) {
		e.preventDefault();
		this.setState({ showResults: false });
		this.clearInput();
		this.props.openChat(result);
	}
	
	closeResults(close) {
		this.setState(state => ({ showResults: state.results.length > 0 && !close }));
	}
	
	renderSearchResults() {
		return this.state.results.map(result => {
			const imgPath = result.imgPath || process.env.PUBLIC_URL+"/images/profile-placeholder.png";
			return <div className={"result"} key={result.id} onClick={(e) => this.handleClick(e, result)}>
				<img alt={"result avatar"} src={imgPath}/>
				<div>
					<span className="username">{result.userName}</span>
					<span className="name">{result.firstName + " " + result.lastName}</span>
				</div>
			</div>;
		});
	}
	
	render() {
		return <div className={"new-chat"}>
			<form
				onSubmit={this.handleSubmit}
				className="send-message-form">
				<input
					ref={this.inputBox}
					onChange={this.handleChange}
					value={this.state.query}
					placeholder="Search a user 🔎"
					type="text"
					onFocus={this.handleChange}
				/>
				<Overlay
					target={this.inputBox.current}
					show={this.state.showResults && this.state.results.length > 0}
					placement="bottom"
					rootClose={true}
					onHide={() => this.closeResults(true)}
				>
					<UpdatingPopover className={"contacts-results"} >
						{this.renderSearchResults()}
					</UpdatingPopover>
				</Overlay>
			</form>
			
		</div>;
	}
}

NewChat.propTypes = {
	user: PropTypes.shape({
		userName: PropTypes.string,
		id: PropTypes.number
	}).isRequired,
	openChat: PropTypes.func.isRequired,
	setActive: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(NewChat);
