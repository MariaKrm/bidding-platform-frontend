import React from "react"

//Display full image in new tab
function DisplayImage() {
	const query = new URLSearchParams(window.location.search)
	const imageURL = query.get("url")

	//imageURL could be local or from server

	return (
		<div className="image-display-background">
			<img className="image-display" src={imageURL} alt="" />
		</div>
	)

}

export default DisplayImage