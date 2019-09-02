import React, { Component } from "react"
import ReactTooltip from "react-tooltip"
import AccountOptions from "./AccountOptions"


class AccountPreview extends Component {
	render() {
		return (
			<div className="account-preview">
				<div className="preview-text">
					<div className="preview-title-group">
						<div className="bidder">
							<span>
								<a href={`/accounts/${this.props.account.id}`} className="account-name">{this.props.account.username}</a>
							</span>
							<span className="seller-rating-big" data-tip data-for="seller-rating">&nbsp;&nbsp;&#9733;{this.props.account.sellerRating}</span>
							<ReactTooltip id="seller-rating" place="top" type="warning" effect="solid">
								<span>Seller Rating</span>
							</ReactTooltip>
							<span className="bidder-rating-big" data-tip data-for="bidder-rating">&nbsp;&nbsp;&#9733;{this.props.account.bidderRating}</span>
							<ReactTooltip id="bidder-rating" place="top" type="success" effect="solid">
								<span>Bidder Rating</span>
							</ReactTooltip>
							{this.props.account.address ? <p className="bidder-location-big">{this.props.account.address.locationTitle}</p> : null}
						</div>
						{!this.props.account.verified ? <p style={{color: "red"}}>Not Verified</p> : null}
						<AccountOptions account={this.props.account} className="preview-menu" history={this.props.history} />
					</div>
				</div>
			</div>
		)
	}
}

export default AccountPreview