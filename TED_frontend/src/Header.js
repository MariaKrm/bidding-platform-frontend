import React from "react"
import "./style.css"


function Header() {
	return (
		<div className="title-header">
			<img style={{verticalAlign: "middle"}} src={require("./images/white_hammer_icon_smaller.png")} alt="logo" />
			<span>BidderSiteNameWhatever</span>
		</div>
	)
}

export default Header