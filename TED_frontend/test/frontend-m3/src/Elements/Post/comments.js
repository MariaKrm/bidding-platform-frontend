import React, {Component} from "react";
import Comment from "../Comment/index";
import PropTypes from "prop-types";


export default class PostComments extends Component {
	render() {
		const croppedComments = this.props.comments.slice(0, this.props.commentsToShow);
		croppedComments.reverse();
		return <div className="comments-wrap">
			<div className="container" ref={this.comments}>
				{
					croppedComments.map((comment,index) => (
						<Comment
							post={this.props.post}
							key={index}
							comment={comment}
							handleCommentDelete={this.props.handleCommentDelete}
						/>))
				}
				{this.props.comments.length === 0 && <p className={"no-comments"}>There are currently no comments concerning this post.<br/>Check back later.</p>}
			</div>
		</div>;
	}
}

PostComments.propTypes = {
	commentsToShow: PropTypes.number,
	comments: PropTypes.arrayOf(PropTypes.object),
	handleCommentDelete: PropTypes.func,
	post: PropTypes.object
};
