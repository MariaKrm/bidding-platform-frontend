import React, { Component } from "react"
import { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"

class SearchBar extends Component {

	constructor() {
		super()
		this.state = {
			text: "",
			keyPresses: 1,
			suggestions: [],
			displaySuggestions: true,
		}

		this.getSuggestions = this.getSuggestions.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.handleFocus = this.handleFocus.bind(this)
		this.handleBlur = this.handleBlur.bind(this)
		this.handleSuggestSelect = this.handleSuggestSelect.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)

	}

	getSuggestions(word) {
		console.log("Getting suggestions for: ", word)
		customRequest("GET", `/search/partialMatch?keyword=${word}`)
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
			this.setState({
				suggestions: response.data,
			})
		}).catch(err => {
			displayError(err)
		})
	}

	handleChange(event) {
		const value = event.target.value
		const pos = value.lastIndexOf(" ")
		const lastWord = value.slice(pos+1)
		const keyPresses = this.state.keyPresses + 1 % 10

		this.setState({
			text: value,
			keyPresses: keyPresses,
		})

		if(lastWord.length > 2 && keyPresses % 2 === 0) {
			this.getSuggestions(lastWord)
		}
		else {
			this.setState({
				suggestions: [],
			})
		}
	}

	handleFocus() {
		this.setState({
			displaySuggestions: true,
		})
	}

	handleBlur() {
		setTimeout(() => {
			this.setState({
				displaySuggestions: false,
			})
		}, 100)
		
	}

	handleSuggestSelect(event) {
		const { id, textContent } = event.target
		console.log("textContent: ", textContent)
		this.setState({
			text: textContent,
		})
	}

	handleSubmit(event) {
		event.preventDefault()
		console.log("poopoop")
	}

	render() {
		let suggestionBox = null
		const suggestions = this.state.suggestions.map((suggestion, index) => {
			return (
				<div key={index} className="search-suggestion" onClick={this.handleSuggestSelect}>{suggestion}</div>
			)
		})

		if(this.state.displaySuggestions && suggestions.length > 0) {
			suggestionBox = 
				<div className="search-suggestion-list">
					{suggestions}
				</div>
		}

		return (
			<form onSubmit={this.handleSubmit} onBlur={this.handleBlur} onFocus={this.handleFocus}>
				<input
					type="text"
					className="search-bar"
					placeholder="Search"
					value={this.state.text}
					onChange={this.handleChange}
				 />
				 <button className="main-button" type="submit">Search</button>
				 <div className="search-suggestion-container">
					 {suggestionBox}
				 </div>
			</form>
		)
	}
}

export default SearchBar