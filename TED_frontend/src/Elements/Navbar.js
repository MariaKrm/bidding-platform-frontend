import React, { Component } from "react"
import AuthHelper from "../utils/AuthHelper"


class Navbar extends Component {
	render() {
		return (
			<nav className="navbar navbar-expand-sm bg-dark navbar-dark">
				<ul className="navbar-nav">
					<li className={"nav-item " + this.props.homeTab}><a className="nav-link" href="/home">Home</a></li>
					
					{AuthHelper.loggedIn() ?
						<li className={"nav-item " + this.props.auctionTab}><a className="nav-link" href="/auction-management/my-open-auctions">Auction Management</a></li>
						// eslint-disable-next-line
						: <li className="nav-item disabled"><a className="nav-link" href="#" disabled>Auction Management</a></li>
					}

					{AuthHelper.isAdmin() ?
						<li className={"nav-item " + this.props.accountTab}><a className="nav-link" href="/account-management/pending-registers">Account Management</a></li>
						: null
					}
					
				</ul>
			</nav>
		)
	}
}


export default Navbar