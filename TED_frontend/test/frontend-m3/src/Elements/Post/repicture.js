import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import Timestamp from "../Timestamp";

export default class RepostPicture extends Component {
	render() {
		const { innerPost, innerPost: { user: author} } = this.props.post;
		const imgPath = author.imgPath || process.env.PUBLIC_URL+"/images/profile-placeholder.png";
		return <NavLink to={"/profile/"+author.userName+"/post/"+innerPost.id} className={"repost"}>
			<div className={"repost-info"}>
				<div className={"author"}>
					<img className={"avatar"} src={imgPath}/>
					<span>
						<span className={"username"}>{author.userName}</span>
						<Timestamp since={innerPost.createdAt}/>
					</span>
				</div>
				<div className={"stats"}>
					<span className={"comments"}>
						<i className="fas fa-comment"/>
						{innerPost.nComments}
					</span>
					<span className={"likes"}>
						<i className="fas fa-heart"/>
						{innerPost.nLikes}
					</span>
				</div>
			</div>
			{this.props.children}
		</NavLink>;
	}
}

RepostPicture.propTypes = {
	children: PropTypes.arrayOf(PropTypes.element),
	post: PropTypes.shape({
		innerPost: PropTypes.object
	})
};
