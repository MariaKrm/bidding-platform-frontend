import React, {Component, Fragment} from "react";
import Comment from "../Comment/index";
import PostInput from "./input";
import { request } from "../../utils";
import PropTypes from "prop-types";

export default class PostCommentsModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			comments: [],
			commentsToShow: this.props.commentsToShow
		};
		
		this.comments = React.createRef();
		
		this.commentsIncrement = 5;
		
		
		this.loadComments = this.loadComments.bind(this);
		this.handleNewComment = this.handleNewComment.bind(this);
		this.handleDeleteComment = this.handleDeleteComment.bind(this);
		this.showMore = this.showMore.bind(this);
		this.showAll = this.showAll.bind(this);
	}
	
	componentDidMount() {
		this.loadComments();
	}
	
	handleNewComment(comment) {
		this.setState(state => ({ comments: state.comments.concat([comment])}), this.showMore);
	}
	
	handleDeleteComment(id) {
		this.setState(state => ({ comments: state.comments.filter(comment => comment.id !== id)}));
	}
	
	showMore(event) {
		if (event) event.preventDefault();
		this.setState( state => ({ commentsToShow: state.commentsToShow+this.commentsIncrement}));
	}
	
	showAll(event) {
		if (event) event.preventDefault();
		this.setState(state => ({ commentsToShow: state.comments.length }), () => {
			const { current: comments } = this.comments;
			comments.scrollTop = comments.scrollHeight;
		});
	}
	
	loadComments() {
		request.send("GET", `/post/${this.props.post.id}/comments`).then(res => res.data).then(comments => {
			comments.reverse();
			this.setState({ comments });
		});
	}
	
	renderComments() {
		const croppedComments = this.state.comments.slice(0, this.state.commentsToShow);
		return 	<div className="container" ref={this.comments}>
			{
				croppedComments.map((comment,index) => (
					<Comment
						post={this.props.post}
						key={index}
						comment={comment}
						setModal={this.props.setModal}
						handleCommentDelete={this.handleDeleteComment}
					/>))
			}
			{this.state.comments.length === 0 && <p className={"no-comments"}>There are currently no comments concerning this post.<br/>Check back later.</p>}
		</div>;
	}

	render() {

		const seeMore = <a href="/" className="see-more" onClick={this.showMore}>
            See more
		</a>;
		
		const seeAll = <a href="/" className="see-all" onClick={this.showAll}>
            See all
		</a>;
		

		return <Fragment>
			<div className="comments-wrap">
				{this.renderComments()}
				{(this.state.commentsToShow < this.state.comments.length) &&
				<div className={"comments-actions"}>
					{ seeMore }
					{ seeAll }
				</div>
				}
			</div>
			<PostInput
				post={this.props.post}
				handleNewComment={this.handleNewComment}
				showAllComments={this.showAllComments}
			/>
		</Fragment>;
	}
}

PostCommentsModal.propTypes = {
	commentsToShow: PropTypes.number,
	post: PropTypes.object,
	setModal: PropTypes.func
};
