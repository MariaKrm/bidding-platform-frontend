import React, { Component } from "react"
import Header from "../Elements/Header"
import SearchBar from "../Search/SearchBar"
import AccountButtons from "../Elements/AccountButtons"
import AuthHelper from "../utils/AuthHelper"
import HomeTabs from "./HomeTabs"


class HomePage extends Component {

	render() {
		return (
			<div>
				<div className="home-header">
					<Header />
					<div className="home-header-search">
						<SearchBar />
					</div>
					<AccountButtons history={this.props.history} />
				</div>
				{AuthHelper.displayVisitorSign()}

				<HomeTabs history={this.props.history} />
			</div>
		)
	}
}

export default HomePage