import React, { Component } from "react";
import {NavLink} from "react-router-dom";
import PropTypes from "prop-types";

export default class TopPostPreview extends Component {
	render() {
		const { post } = this.props;
		const videoExt = ["mp4", "flv", "wmv"];
		const type = post.getMediaPath.slice(-4, post.getMediaPath.length).split(".", 2)[1];
		const avatar = post.user.imgPath || process.env.PUBLIC_URL+"/images/profile-placeholder.png";
		return <NavLink to={"/profile/"+post.user.userName+"/post/"+post.id}>
			<div className={"post-preview"}>
				<div className={"author"}>
					<img src={avatar}/>
					{post.user.userName}
				</div>
				<div className={"media-container"}>
					{videoExt.includes(type) ? <video controls loop>
						<source src={post.getMediaPath} />
					</video> : <img alt={"post picture"} src={post.getMediaPath}/>}
				</div>
				<div className={"stats"}>
					<span className={"likes"}>
						<i className="fas fa-heart"/>
						{post.nLikes}
					</span>
					<span className={"comments"}>
						<i className="fas fa-comment"/>
						{post.nComments}
					</span>
				</div>
			</div>
		</NavLink>;
	}
}

TopPostPreview.propTypes = {
	post: PropTypes.shape({
		getMediaPath: PropTypes.string.isRequired,
		user: PropTypes.object.isRequired,
		nLikes: PropTypes.number.isRequired,
		nComments: PropTypes.number.isRequired
	})
};
