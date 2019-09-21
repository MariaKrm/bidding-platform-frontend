import React, { Component } from "react"

//For selecting pages
class PageWheel extends Component {
	render() {
		//The parameters we want to keep when changing page
		const params = this.props.params ? this.props.params : ""
		
		//All numbers
		const pageNumbers = []
		for(let i=1; i<=this.props.lastPage; i++) {
			pageNumbers.push(i)
		}

		//Show the 2 pages around selected + first and last page, inbetween show ...
		const pages = pageNumbers.map(num => {
			if(num === 1 || num === this.props.lastPage || (num >= this.props.activePage - 2 && num <= this.props.activePage + 2)) {
				return (
					num == this.props.activePage ?
						<li className="page-item active" key={num}><a href={"?" + params + "page=" + num} className="page-link" id={num}>{num}</a></li>
					:	<li className="page-item" key={num}><a href={"?" + params + "page=" + num} className="page-link" id={num}>{num}</a></li>
				)
			}
			else if(num === 2 || num === this.props.lastPage - 1) {
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