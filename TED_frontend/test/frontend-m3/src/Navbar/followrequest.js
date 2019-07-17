import React, {Component, Fragment} from "react";
import { NavLink } from "react-router-dom";
import UserLink from "../Elements/UserLink";
import Timestamp from "../Elements/Timestamp";
import { request } from "../utils";
import PropTypes from "prop-types";

class FollowRequest extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.handleRequest = this.handleRequest.bind(this);
		this.acceptRequest = this.acceptRequest.bind(this);
		this.declineRequest = this.declineRequest.bind(this);
	}

	handleClick() {
		this.props.setTab(false);
	}

	acceptRequest() {
		this.handleRequest(true);
	}

	declineRequest() {
		this.handleRequest(false);
	}

	handleRequest(accepted) {
		const { id } = this.props.request;
		request.send("POST", `/user/following-request/${id}?accept=${accepted.toString()}`).then(() => {
			this.props.deleteRequest(id);
			this.props.setCount("requests", this.props.count - 1);
		});
	}

	renderFollowRequest() {
		const { user: author } = this.props.request;
		return <Fragment>
			<div>
				<UserLink user={author} onClick={this.handleClick} /> wants to follow you
			</div>
			<div className={"choice"}>
				<button onClick={this.acceptRequest}>Accept</button>
				<button onClick={this.declineRequest}>Decline</button>
			</div>
		</Fragment>;
	}

	render() {
		const { user: author } = this.props.request;
		// Change the className to "FollowRequest" in the future to implement CSS specifically for follow Requests
		const imgPath = author.imgPath || process.env.PUBLIC_URL+"/images/profile-placeholder.png";
		return <li className={"follow-request"}>
			<NavLink to={`/profile/${author.userName}`}><img className={"avatar"} src={imgPath} alt={`${author.userName}'s avatar`}/></NavLink>
			<div className={"info"}>
				{this.renderFollowRequest()}
				<Timestamp since={this.props.request.createdAt}/>
			</div>
		</li>;
	}
}

FollowRequest.propTypes ={
	setTab: PropTypes.func.isRequired,
	request: PropTypes.shape({
		id: PropTypes.string,
		user: PropTypes.object,
		createdAt: PropTypes.string
	}),
	deleteRequest: PropTypes.func.isRequired,
	setCount: PropTypes.func.isRequired,
	count: PropTypes.number,

};

export default class FollowRequests extends Component {
	constructor(props) {
		super(props);

		this.state = {
			requests: [],
		};

		this.loadFollowRequests = this.loadFollowRequests.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.deleteRequest = this.deleteRequest.bind(this);
		this.renderRequests = this.renderRequests.bind(this);
	}

	componentDidMount() {
		this.loadFollowRequests();
	}

	loadFollowRequests() {
		request.send("GET", "/user/following-requests").then(res => res.data).then(requests => {
			this.setState({ requests });
		});
	}

	deleteRequest(id) {
		this.setState(state => ({ requests: state.requests.filter(request => request.id !== id)}));
	}

	handleClick() {
		this.props.setActiveTab(this.props.idx);
	}

	renderRequests() {
		const { requests } = this.state;
		return requests.map((request, i) => {
			return <FollowRequest
				request={request}
				key={i}
				setTab={this.props.setOpenArea}
				deleteRequest={this.deleteRequest}
				setCount={this.props.setCount}
				count={requests.length}
			/>;
		});
	}

	render() {
		const { count } = this.props;
		const listClass = (this.props.activeTab === this.props.idx) ? "show" : "";
		const emptyClass = !(count > 0) ? "empty" : "";
		return <div className={"user-area-item "+listClass}>
			<div className={"header "+emptyClass} onClick={this.handleClick}>Follow Requests <div className={"counter"}>{count}</div></div>
			<div className={"container "+listClass}>
				<ul>
					{this.renderRequests()}
				</ul>
			</div>
		</div>;
	}
}

FollowRequests.propTypes = {
	idx: PropTypes.number,
	setActiveTab: PropTypes.func.isRequired,
	setOpenArea: PropTypes.func.isRequired,
	setCount: PropTypes.func.isRequired,
	count: PropTypes.number,
	activeTab: PropTypes.number
};
