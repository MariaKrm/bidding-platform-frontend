import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";


const mapStateToProps = state => ({ user: state.user });

class ConnectedPostStatistics extends Component {
 
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
 
	handleClick() {
		this.props.toggleLike(this.props.isLiked);
	}
 
	render() {
		const className = (this.props.isLiked) ? "liked" : "";
		return <div className="statistics">
			<span className="likes">
				<button className={className} onClick={this.handleClick}>
					<i className="fas fa-heart"/>
				</button>
			</span>
			<a className="likes-info" href="/" onClick={this.props.onClick}>{this.props.nLikes} people liked this</a>
		</div>;
	}
}

ConnectedPostStatistics.propTypes = {
	toggleLike: PropTypes.func.isRequired,
	isLiked: PropTypes.bool,
	onClick: PropTypes.func,
	nLikes: PropTypes.number
};

const PostStatistics = connect(mapStateToProps)(ConnectedPostStatistics);

export default PostStatistics;
