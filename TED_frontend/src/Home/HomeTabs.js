import React, { Component } from "react"
import {Tabs, Tab} from 'react-bootstrap-tabs';
import Feed from "./Feed"

class HomeTabs extends Component {
	render() {
		return (
			<Tabs className="home-tabs" headerClass="home-tabs-header" activeHeaderClass="home-tabs-active" defaultActiveKey="profile" id="uncontrolled-tab-example">
			 	<Tab label="Feed">
			   		<Feed history={this.props.history} />
			 	</Tab>
			 	<Tab label="Auction Managment">
			    	<div>Hey guys!</div>
				</Tab>
			</Tabs>
		)
	}
}

export default HomeTabs