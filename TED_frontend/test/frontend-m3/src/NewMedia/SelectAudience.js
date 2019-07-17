import React, {Component} from "react";
import {request} from "../utils";
import Popover from "react-bootstrap/Popover";
import Overlay from "react-bootstrap/Overlay";
import PropTypes from "prop-types";


export default class SelectAudience extends Component {
	constructor(props) {
		super(props);
		this.state = {
			blackList: [],
			whiteList: [],
			includeResults: [],
			excludeResults: [],
			showIncludedResults: false,
			showExcludeResults: false,
			userLists: []
		};
		
		this.includeBox = React.createRef();
		this.excludeBox = React.createRef();
		
		this.handleSearch = this.handleSearch.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.closeResults = this.closeResults.bind(this);
	}
	
	componentDidMount() {
		request.send("GET", "list/all").then(res => res.data).then(lists => {
			this.setState({ userLists: lists });
		});
	}
	
	filterLists(query, isWhitelist) {
		if (isWhitelist) return this.state.userLists.filter(
			list => (list.name.toLowerCase().includes(query)
				&& !this.state.whiteList.map(x => x.listId).includes(list.listId)));
		return this.state.userLists.filter(
			list => (list.name.toLowerCase().includes(query)
				&& !this.state.blackList.map(x => x.listId).includes(list.listId))
		);
	}
	
	insert(listToAdd, isWhitelist) {
		const list = (isWhitelist) ? [...this.state.whiteList] : [...this.state.blackList];
		if (list.map(x => x.listId).includes(listToAdd.listId)) return;
		list.push(listToAdd);
		if (isWhitelist) {
			this.setState({ whiteList: list});
		} else {
			this.setState({ blackList: list });
		}
		return this.props.setList(list.map(x=>x.listId).toString(), isWhitelist);
	}
	
	remove(listToRemove, isWhitelist) {
		const list = (isWhitelist) ? [...this.state.whiteList] : [...this.state.blackList];
		const found = list.findIndex(x => x.listId === listToRemove.listId);
		if (found >= 0) list.splice(found, 1);
		if (isWhitelist) return this.setState({ whiteList: list });
		return this.setState({ blackList: list });
	}
	
	handleFocus(event, isWhitelist) {
		if (isWhitelist) return this.setState(state => ({ showIncludedResults: state.includeResults.length > 0 }));
		return this.setState(state => ({ showExcludedResults: state.excludeResults.length > 0 }));
	}
	
	handleSearch(event, isWhitelist) {
		event.persist();
		if (this.timer) {
			clearTimeout(this.timer);
		}
		const { value } = event.target;
		const matched = (value.trim() !== "") ? this.filterLists(value.trim().toLowerCase(), isWhitelist) : [];
		if (isWhitelist) {
			return this.setState({ includeResults: matched, showIncludedResults: matched.length > 0 });
		}
		this.setState({ excludeResults: matched, showExcludedResults: matched.length > 0 });
	}
	
	closeResults(isWhitelist) {
		if (isWhitelist) return this.setState({ showIncludedResults: false });
		return this.setState({ showExcludedResults: false });
	}
	
	handleClick(event, list, isInsert, isWhitelist) {
		event.stopPropagation();
		this.closeResults(isWhitelist);
		const action = (isInsert) ? this.insert.bind(this) : this.remove.bind(this);
		action(list, isWhitelist);
	}
	
	renderSearchResults(isWhitelist) {
		if (isWhitelist) return this.state.includeResults.map((element, i) => <div
			key={"l"+i}
			className="element"
			onClick={(event) => this.handleClick(event, element, true, isWhitelist)}
		>
			<i className="fas fa-list-ul"/>
			{element.name}
		</div>);
		return this.state.excludeResults.map((element, i) => <div
			key={"r"+i}
			className="element"
			onClick={(event) => this.handleClick(event, element, true, isWhitelist)}
		>
			<i className="fas fa-list-ul"/>
			{element.name}
		</div>);
	}
	
	renderSelected(isWhitelist) {
		if (isWhitelist) return this.state.whiteList.map((element, i) => <div
			key={"l"+i}
			className="element"
		>
			<span className={"count"}>{element.size}</span>
			{element.name}
			<i className="fas fa-times-circle" onClick={(event) => this.handleClick(event, element, false, isWhitelist)}/>
		</div>);
		return this.state.blackList.map((element, i) => <div
			key={"r"+i}
			className="element"
		>
			<span className={"count"}>{element.size}</span>
			{element.name}
			<i className="fas fa-times-circle" onClick={(event) => this.handleClick(event, element, false, isWhitelist)}/>
		</div>);
	}
	
	render() {
		return <div className={"selectAudience"}>
			<div className={"whitelist"}>
				<input ref={this.includeBox} type="text" placeholder="Include a list..." onFocus={(event) => this.handleFocus(event, true)} onChange={(event) => this.handleSearch(event, true)}/>
				<Overlay
					target={this.includeBox.current}
					show={this.state.showIncludedResults}
					placement="top"
					rootClose={true}
					onHide={() => this.closeResults(true)}
				>
					<Popover className={"results"} >
						{this.renderSearchResults(true)}
					</Popover>
				</Overlay>
				<div className={"selected"}>
					{this.renderSelected(true)}
				</div>
			</div>
			<div className={"blacklist"}>
				<input ref={this.excludeBox} type="text" placeholder="Exclude a list..." onFocus={(event) => this.handleFocus(event, false)} onChange={(event) => this.handleSearch(event, false)}/>
				<Overlay
					target={this.excludeBox.current}
					show={this.state.showExcludedResults}
					placement="top"
					rootClose={true}
					onHide={() => this.closeResults(false)}
				>
					<Popover className={"results"} >
						{this.renderSearchResults(false)}
					</Popover>
				</Overlay>
				<div className={"selected"}>
					{this.renderSelected(false)}
				</div>
			</div>
		</div>;
	}
}

SelectAudience.propTypes = {
	setList: PropTypes.func.isRequired
};
