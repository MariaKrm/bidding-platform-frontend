import React, { Component } from "react"
import AuthHelper from "../utils/AuthHelper"

function Banner(props) {

	return (
		<div>
			{AuthHelper.displayVisitorSign()}
			{props.message && props.type ?
				<div class={"alert alert-" + props.type}>
				 	{props.message}
				</div>
				: null
			}
		</div>
	)
}

export default Banner