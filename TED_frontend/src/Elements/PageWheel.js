import React, { Component } from "react"


class PageWheel extends Component {
	render() {
		const pageNumbers = []
		for(let i=1; i<=this.props.lastPage; i++) {
			pageNumbers.push(i)
		}

		const pages = pageNumbers.map(num => {
			if(num === 1 || num === this.props.lastPage || (num >= this.props.activePage - 2 && num <= this.props.activePage + 2)) {
				return (
					num == this.props.activePage ?
						<li className="page-item active" key={num}><a href={"?page=" + num} className="page-link" id={num}>{num}</a></li>
					:	<li className="page-item" key={num}><a href={"?page=" + num} className="page-link" id={num}>{num}</a></li>
				)
			}
			else if(num === 2 || num === this.props.lastPage - 1){
				return <div key={num}>...</div>
			}
			else {
				return null
			}
		})

		return (
			<ul className="pagination justify-content-center">
				{pages}
			</ul>
		)
	}
}

export default PageWheel