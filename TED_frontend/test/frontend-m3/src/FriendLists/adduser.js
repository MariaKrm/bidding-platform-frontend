import React, {Component, Fragment} from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import connect from "react-redux/es/connect/connect";
import PropTypes from "prop-types";
import { request } from "../utils";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import UserResult from "../Elements/UserResult";

const mapStateToProps = state => ({ user: state.user });

class ListAddUser extends Component {
	constructor(props) {
		super(props);
		this.state = {
			active: false,
			results: [],
			target: null,
			selected: null
		};
		
		this.attachRef = target => this.setState({ target });
		
		this.timer = null;
		
		this.queryDelay = 350;
		
		this.handleQuery = this.handleQuery.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleClickUser = this.handleClickUser.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	handleBlur() {
		this.setState({ active: false });
	}
	
	matchUser(user, query) {
		const matchUsername = user.userName.toLowerCase().includes(query);
		const matchFirstname = user.firstName.toLowerCase().includes(query);
		const matchLastname = user.lastName.toLowerCase().includes(query);
		return matchUsername || matchFirstname || matchLastname;
	}
	
	handleClickUser(event, user) {
		event.preventDefault();
		this.setState({ selected: user });
		const { target } = this.state;
		target.value = user.userName;
	}
	
	handleSubmit() {
		if (!this.state.selected) return;
		request.send("PUT", `/list/${this.props.list.listId}/${this.state.selected.id}`)
			.then(res => res.data)
			.then(() => {
				this.props.handleNewMember(this.state.selected);
				this.setState({selected: null});
				const { target } = this.state;
				target.value = "";
			});
	}
	
	handleQuery(event) {
		if (this.timer) clearTimeout(this.timer);
		const query = event.target.value.toLowerCase();
		this.timer = setTimeout(() => request.send("GET", "/user/getFollowers/"+this.props.user.userName)
			.then(res => res.data).then(followers => {
				const results = followers.filter(user => {
					const matched = this.matchUser(user, query);
					const inList = this.props.currentMembers.find(member => {
						return member.userName === user.userName;
					});
					return matched && !inList;
				});
				this.setState({ results, active: true });
			}), this.queryDelay);
	}
	
	renderResults() {
		if (this.state.results.length === 0) return <span>No results found</span>;
		return this.state.results.map((result, i) => <UserResult
			user={result}
			key={i}
			onClick={this.handleClickUser}
		/>);
	}
	
	render() {
		return  <Fragment>
			<Form ref={this.attachRef} inline>
				<FormControl
					type="text"
					placeholder="Search Follower"
					onChange={this.handleQuery}
					onBlur={this.handleBlur}
				/>
				<Button onClick={this.handleSubmit} variant="outline-primary">Add</Button>
			</Form>
			{<Overlay
				target={this.state.target}
				show={this.state.active}
				placement="top"
				rootClose={true}
				onHide={this.handleBlur}
			>
				<Popover>
					{this.renderResults()}
				</Popover>
			</Overlay>}
		</Fragment>;
	}
}

const ConnectedListAddUser = connect(mapStateToProps)(ListAddUser);

ListAddUser.propTypes = {
	user: PropTypes.shape({
		userName: PropTypes.string.isRequired
	}).isRequired,
	currentMembers: PropTypes.arrayOf(PropTypes.object).isRequired,
	list: PropTypes.object.isRequired,
	handleNewMember: PropTypes.func.isRequired
};

export default ConnectedListAddUser;

