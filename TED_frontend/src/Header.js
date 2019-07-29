import React from "react"


function Header() {
	return (
		<div className="title-header">
			<img style={{verticalAlign: "middle"}} src={require("./images/white_hammer_icon_smaller.png")} alt="logo" />
		{/*	<img style={{verticalAlign: "middle"}} src={require("./images/cow_logo1_68_white.png")} alt="logo" />*/}
			<span className="header-text">BidderSiteNameWhatever</span>
		</div>
	)
}

export default Header