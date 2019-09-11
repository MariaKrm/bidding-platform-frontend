import React from "react"

function DisplayImage() {
	const query = new URLSearchParams(window.location.search)
	const imageURL = query.get("url")

	return (
		<div className="image-display-background">
			<img className="image-display" src={imageURL} alt="" />
		</div>
	)

}

export default DisplayImage