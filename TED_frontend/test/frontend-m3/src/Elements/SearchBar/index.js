import React, { Component } from "react";
import SearchResults from "./results";
import {request} from "../../utils/index";
import PropTypes from "prop-types";

export default class SearchBar extends Component {
	constructor(props) {
		super(props);
  
		this.state = {
			active: false,
			results: [],
			query: ""
		};
  
		this.timer = null;
  
		this.queryDelay = 350;
  
		this.searchBox = props.forwardRef;
  
		this.handleBlur = this.handleBlur.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.sendQuery = this.sendQuery.bind(this);
	}
 
	componentDidMount() {
		window.addEventListener("click", this.handleClick);
	}
 
	componentWillUnmount() {
		window.removeEventListener("click", this.handleClick);
	}
 
 
	handleFocus() {
		this.sendQuery();
		this.setState({ active: true });
	}
 
	handleBlur() {
		this.setState({ active: false, results: [] });
	}
 
	handleClick(event) {
		if (!this.state.active) return;
		if (!this.searchBox) return;
		const { current: searchBox} = this.searchBox;
		if (!searchBox.contains(event.target)) {
			this.handleBlur();
		}
	}
	
	sendQuery() {
		let results = [];
		const { query } = this.state;
		if (query.trim() === "") return;
		let count = 0;
		const callback = () => {
			count++;
			if (count === 3) this.setState({ results });
		};
		request.send("GET", `/user/search?name=${query}`).then(res => res.data).then(data => {
			data.forEach(result => results.push(result));
		}).finally(callback);
		request.send("GET", `/post/hashtags/${query}`).then(res => res.data).then(data => {
			data.forEach(result => results.push(result));
		}).finally(callback);
		request.send("GET", `/location/search?query=${query}`).then(res => res.data).then(data => {
			data.forEach(result => results.push(result));
		}).finally(callback);
	}
 
	handleChange(event) {
		event.persist();
		this.setState({ query: event.target.value }, () => {
			if (this.timer) {
				clearTimeout(this.timer);
			}
			const { query } = this.state;
			this.timer = setTimeout(() => {
				if (query.trim() === "") return this.setState({ results: [] });
				this.sendQuery();
			}, this.queryDelay);
		});
	}
 
	render() {
		const activeClass = (this.state.active) ? " active" : "";
		return <div ref={this.searchBox} className={"nav-item nav-search" + activeClass}>
			<input
				type="search"
				placeholder="Search"
				onChange={this.handleChange}
				onFocus={this.handleFocus}/>
			<i className="fas fa-search"/>
			{this.props.navbarActive && this.state.active && <SearchResults
				results={this.state.results}
				onBlur={this.handleBlur}
			/>}
		</div>;
	}
}

SearchBar.propTypes = {
	forwardRef: PropTypes.object,
	navbarActive: PropTypes.bool,
};
