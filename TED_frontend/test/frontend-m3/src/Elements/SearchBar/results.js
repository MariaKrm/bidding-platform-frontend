import React, {Component} from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import UserResult from "./userresult";
import PropTypes from "prop-types";
import LocationResult from "./locationresult";
import HashtagResult from "./hashtagresult";


const mapStateToProps = (state) => ({ user: state.user });

class ConnectedSearchResults extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			activeIndex: -1,
			redirecting: false,
			renderedResults: [],
		};
		
		this.resultsBox = React.createRef();
		
		this.setActiveIndex = this.setActiveIndex.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}
	
	setActiveIndex(idx) {
		this.setState({ activeIndex: idx });
	}
	
	prevIndex() {
		let { activeIndex: idx } = this.state;
		if (idx - 1 < 0) return;
		idx -= 1;
		if (idx < this.props.results.length - 3) {
			const { current: searchBox } = this.resultsBox;
			searchBox.scrollTop = searchBox.scrollTop - 45;
		}
		this.setActiveIndex(idx);
	}
	
	nextIndex() {
		let { activeIndex: idx } = this.state;
		if (idx + 1 > this.props.results.length - 1) return;
		idx += 1;
		if (idx > 2) {
			const { current: searchBox } = this.resultsBox;
			searchBox.scrollTop = searchBox.scrollTop + 45;
		}
		this.setActiveIndex(idx);
	}
	
	handleKeyDown(event) {
		switch (event.keyCode) {
		case 38: this.prevIndex();
			break;
		case 40: this.nextIndex();
			break;
		case 13: this.setState({ redirecting: true });
			break;
		default: break;
		}
	}
 
	componentDidMount() {
		window.addEventListener("keydown", this.handleKeyDown);
		document.body.style.overflowY = "hidden";
	}
 
	componentWillUnmount() {
		window.removeEventListener("keydown", this.handleKeyDown);
		document.body.style.overflowY = "auto";
	}
	
	handleClick(event) {
		event.preventDefault();
		this.setState({ redirecting: true });
	}
	

	renderResults() {
		const results = this.props.results.map((result, i) => {
			const className = (this.state.activeIndex === i) ? "selected" : "";
			if (!result.tag && !result.apiIdentifier) return <UserResult
				className={className}
				key={result.userName}
				index={i}
				result={result}
				onClick={this.handleClick}
				setActive={this.setActiveIndex}
			/>;
			if (!result.tag) return <LocationResult
				className={className}
				key={result.apiIdentifier}
				index={i}
				result={result}
				setActive={this.setActiveIndex}
			/>;
			return <HashtagResult
				className={className}
				key={result.id}
				index={i}
				result={result}
				setActive={this.setActiveIndex}
			/>;
			
		});
		return (results.length === 0) ? <span className="search-result">No results found.</span> : results;
	}
	
	redirect() {
		this.setState({ redirecting: false });
		this.props.onBlur();
		if (this.props.results[this.state.activeIndex]) return <Redirect to={`/profile/${this.props.results[this.state.activeIndex].userName}`}/>;
		return null;
	}
 
	render() {
		if (this.props.query === "") return null;
		return <div className="search-box" ref={this.resultsBox}>
			{this.state.redirecting && this.redirect()}
			{this.renderResults()}
		</div>;
	}
}

ConnectedSearchResults.propTypes = {
	results: PropTypes.arrayOf(PropTypes.object),
	onBlur: PropTypes.func.isRequired,
	query: PropTypes.string
};

const SearchResults = connect(mapStateToProps)(ConnectedSearchResults);

export default SearchResults;


