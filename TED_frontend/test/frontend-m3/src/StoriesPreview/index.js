import React, {Component} from "react";
import Preview from "./preview";
import NewStory from "./newStory";
import {request} from "../utils";
// import Timestamp from "../Elements/Timestamp";

export default class StoriesPreview extends Component {
	constructor(props) {
		super(props);

		this.state = {
			stories: []
		};

		this.addStory = this.addStory.bind(this);
	}

	componentDidMount() {
		this.loadStories();
	}

	addStory() {
		this.loadStories();
	}

	loadStories() {
		request.send("GET", "/stories").then(res => res.data).then(stories => {
			stories.forEach(userStory => {
				userStory.stories.forEach(story => {
					if (story.url.split(".").pop() === "mp4") {
						story.type = "video";
					}
					if (!story.header.profileImage) {
						story.header.profileImage = process.env.PUBLIC_URL+"/images/profile-placeholder.png";
					}
					// story.header.subheading = <Timestamp since={story.header.subheading}/>;
				});
			});
			this.setState({ stories });
		});
	}

	render() {
		return <div className={"stories"}>
			<h3>Stories</h3>
			<div className="storiesPreview">
				<NewStory addStory={this.addStory}/>
				{this.state.stories.map(story => <Preview key={story.user} story={story}/>)}
			</div>
		</div>
		;
	}
}
