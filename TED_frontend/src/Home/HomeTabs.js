import React, { Component } from "react"
import {Tabs, Tab} from 'react-bootstrap-tabs'
import Feed from "./Feed"
import AuthHelper from "../utils/AuthHelper"
import AuctionManagment from "./AuctionManagment"

class HomeTabs extends Component {

	render() {

		return (
			<Tabs className="home-tabs" headerClass="home-tabs-header" activeHeaderClass="home-tabs-active">
			 	<Tab label="Feed">
			   		<Feed history={this.props.history} />
			 	</Tab>
			 	{AuthHelper.loggedIn() ?
			 		<Tab label="Auction Managment">
			 			<AuctionManagment history={this.props.history} />
					</Tab>
					: <Tab label="Auction Managment" disabled />
				}

				{AuthHelper.isAdmin() ?
					<Tab label="Account Managment">
						<div>Page only accessible to the admin</div>
					</Tab>
					: <Tab label="" />
				}
			</Tabs>
		)
	}
}

export default HomeTabs