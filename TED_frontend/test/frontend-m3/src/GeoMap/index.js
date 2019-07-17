import React, { Component } from "react";
import Map from "./map";
import { request } from "../utils";
import PropTypes from "prop-types";

export default class GeoMap extends Component {
	constructor(props) {
		super(props);
		this.state = {
			posts: []
		};

		this.userName = props.match.params.userName;
		this.loadPosts = this.loadPosts.bind(this);
	}

	componentDidMount() {
		this.loadPosts();
		document.body.style.overflow = "hidden";
	}
	
	componentWillUnmount() {
		document.body.style.overflow = "auto";
	}
	
	UNSAFE_componentWillReceiveProps(nextProps) {
		this.userName = nextProps.match.params.userName;
		this.loadPosts();
	}

	loadPosts() {
		request.send("GET", "/user/"+this.userName).then(res => res.data).then(user => user.posts).then(posts => {
			this.setState({ posts });
		});
	}

	render() {
		if (!this.userName) return null;
		return <div className={"geomap"} >
			<Map posts={this.state.posts}/>
		</div>;
	}
}

GeoMap.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			userName: PropTypes.string
		})
	})
};
