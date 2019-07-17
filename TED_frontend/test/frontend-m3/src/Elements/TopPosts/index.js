import React, { Component } from "react";
import PostPreview from "./preview";
import { request } from "../../utils";

export default class TopPosts extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mostRecent: true,
			posts: []
		};
		
		this.handleClick = this.handleClick.bind(this);
	}
	
	componentDidMount() {
		this.loadPosts();
	}
	
	loadPosts() {
		const time = this.state.mostRecent ? 10 : 60;
		request.send("GET", "/feed/mostpopular/"+time).then(res => res.data).then(posts => {
			this.setState({ posts });
		});
	}
	
	handleClick(e) {
		e.preventDefault();
		this.setState(state => ({ mostRecent: !state.mostRecent }), this.loadPosts);
	}
	
	render() {
		return <div className={"top-posts"}>
			<div className={"header"}>
				<h3>Most Popular Posts</h3>
				<span>
					<button className={!this.state.mostRecent ? "active" : null} onClick={this.handleClick}>Last hour</button>
					<button className={this.state.mostRecent ? "active" : null} onClick={this.handleClick}>Last 10 minutes</button>
				</span>
			</div>
			<div className={"most-popular-posts"}>
				{this.state.posts.length > 0 ?
					this.state.posts.map((post, i) => <PostPreview key={""+i+post.id} post={post}/>) :
					<span>No popular posts to show in the past {this.state.mostRecent ? "10 minutes" : "hour"}</span>
				}
			</div>
		</div>;
	}
}
