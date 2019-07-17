import React, {Component, Fragment} from "react";
import { parseQuery } from "../utils";
import PropTypes from "prop-types";
import { request } from "../utils";
import Jumbotron from "react-bootstrap/Jumbotron";
import Post from "../Elements/Post";
import FollowHashtagButton from "../Elements/Follow/hashtag";

export default class HashtagPage extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			results: [],
			postsShown: 5,
			hasMore: false,
			isUpdating: false
		};
		
		this.postsIncrement = 5;
		
		const { search } = this.props.location;
		this.query = parseQuery(search);
		this.handleWheel = this.handleWheel.bind(this);
	}
	
	componentDidMount() {
		this.loadPosts();
		window.addEventListener("wheel", this.handleWheel);
	}
	
	componentWillUnmount() {
		window.removeEventListener("wheel", this.handleWheel);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { search } = nextProps.location;
		this.query = parseQuery(search);
		this.loadPosts();
	}
	
	loadOlderPosts() {
		const { results, isUpdating } = this.state;
		if (results.length === 0 || isUpdating) return;
		this.setState(state => ({ isUpdating: true, postsShown: state.postsShown + this.postsIncrement }));
		setTimeout(() => {
			this.setState(state => ({ isUpdating: false, hasMore: results.length > state.postsShown }));
		}, 250);
	}
	
	handleWheel() {
		if (this.state.isUpdating || !this.state.hasMore) return;
		if (window.innerHeight + document.documentElement.scrollTop > document.documentElement.offsetHeight - 200) {
			this.loadOlderPosts();
		}
	}
	
	loadPosts() {
		if (!this.query.hashtag) return;
		request.send("GET", "/post/HashtagSearch/"+this.query.hashtag).then(res => res.data).then(posts => {
			this.setState(state => ({ results: posts, hasMore: posts.length > state.postsShown }));
		});
	}
	
	renderResults() {
		const { results, postsShown } = this.state;
		return results.slice(0, postsShown).map(result => <Post key={result.id} post={result.id} minComments={4}/>);
	}

	render() {
		const { results } = this.state;
		const plural = results.length === 1 ? "" : "s";
		const hashtag = (this.query.hashtag) ? `#${this.query.hashtag}` : "invalid";
		return <div className={"hashtags"}>
			<Jumbotron>
				<h1>Hashtag Page</h1>
				{results.length > 0 ? <p>Here is a collection of {results.length} post{plural} for {hashtag}</p> : <p>We are sorry. There are no posts related to {hashtag}...</p>}
				<FollowHashtagButton hashtag={this.query.hashtag}/>
			</Jumbotron>
			{results.length > 0 &&
				<Fragment>
					<ul>
						{this.renderResults()}
					</ul>
					{this.state.postsShown >= this.state.results.length && <span>There are no more posts to show...</span>}
				</Fragment>
			}
		</div>;
	}
}

HashtagPage.propTypes = {
	location: PropTypes.shape({
		search: PropTypes.string
	})
};
