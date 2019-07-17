import React, { Component, Fragment } from "react";
import { ForceGraph2D } from "react-force-graph";
import { request } from "../utils";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import ProfilePreviewer from "../Profile/preview";
import Swal from "sweetalert2";
import {NavLink} from "react-router-dom";

const mapStateToProps = (state) => ({ user: state.user });

class ShortestPath extends Component {
	constructor(props) {
		super(props);
		this.state = {
			nodes: [],
			links: [],
			paths: [],
			highlightLink: null,
			highlightNodes: [],
			activePath: null,
			redirecting: false,
			previewUsers: [],
			minHops: 0,
			inUseColors: []
		};
		this.lastClick = Date.now();
		this.destinationHref = null;
		this.radius = 8;
		this.handleClick = this.handleClick.bind(this);
		this._handleLinkHover = this._handleLinkHover.bind(this);
		this._handleNodeHover = this._handleNodeHover.bind(this);
		this._paintNode = this._paintNode.bind(this);
	}
	
	componentDidMount() {
		this.loadConnections();
	}
	
	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.match.params.userName !== this.props.match.params.userName) {
			this.loadConnections();
		}
	}
	
	loadConnections() {
		const { userName: targetUserName } = this.props.match.params;
		this.setState({ nodes: [], links: [] });
		request.send("GET", "user/friends/path/"+targetUserName).then(res => res.data).then(paths => {
			this.setState({ paths });
			paths.forEach((path, i) => {
				this.parsePath(path, i);
			});
		}).catch(err => {
			if (!err.response) return;
			Swal.fire({
				type: "error",
				title: `${err.response.status}: ${err.response.statusText}`,
				text: err.response.data.text,
				timer: 3000
			}).then(() => {
				this.props.history.goBack();
			});
		});
	}
	
	parsePath(path, k) {
		const colors = ["black", "red", "green", "blue",
			"purple", "orange", "aqua", "blueviolet", "cadetblue",
			"chartreuse", "darkorange", "deepskyblue", "firebrick",
			"gold", "greenyellow", "indigo", "lightcoral"
		].filter(x => !this.state.inUseColors.includes(x));
		const color = colors[Math.floor(Math.random()*colors.length)];
		
		path.color = color;
		path.forEach(x => {
			if (!this.state.nodes.find(n => x.id === n.id)) {
				const node = {
					id: x.id,
					name: x.userName,
				};
				this.setState(state => ({nodes: state.nodes.concat([node])}));
			}
		});

		for (let i = 0, j = 1; j < path.length; i++, j++) {
			const [prevNode, nextNode] = [path[i], path[j]];
			const link = {
				source: prevNode.id,
				target: nextNode.id,
				color,
				path: k
			};
			this.setState(state => ({
				links: state.links.concat([link])
			}));
		}
		
		this.setState(state =>({
			minHops: path.length,
			inUseColors: state.inUseColors.concat([color])
		}));
	}
	
	handleClick(node) {
		if (Date.now() - this.lastClick < 250) {
			this.destinationHref = "/profile/"+node.name;
			this.setState({ redirecting: true });
		}
		this.lastClick = Date.now();
	}
	
	_handleNodeHover(node) {
		this.setState({ highlightNodes: node ? [node] : [], previewUsers: node ? [node.name] : null });
	}
	
	_handleLinkHover(link) {
		this.setState({
			highlightLink: link,
			highlightNodes: link ? [link.source, link.target] : [],
			previewUsers: link ? [link.source.name, link.target.name] : []
		});
	}
	
	_paintNode(node, ctx) {
		const selfOrTarget = node.name === this.props.user.userName || node.name === this.props.match.params.userName;
		const size = selfOrTarget ? 1 : 0.66;
		const { highlightNodes } = this.state;
		if (highlightNodes.indexOf(node) !== -1) { // add ring
			ctx.beginPath();
			ctx.arc(node.x, node.y, this.radius * 1.4*size, 0, 2 * Math.PI, false);
			ctx.fillStyle = "#115ebb";
			ctx.fill();
		}
		ctx.beginPath();
		
		ctx.arc(node.x, node.y, this.radius*size, 0, 2 * Math.PI, false);
		ctx.fillStyle = "#2d82ec";
		ctx.fill();
		if (node.name === this.props.user.userName) {
			ctx.fillStyle = "white";
			ctx.font = "6px Arial";
			ctx.fillText("You", node.x - 5 , node.y + 2);
		}
	}
	
	handlePathSelected(i) {
		if (this.state.activePath === i) return this.setState({ activePath: null });
		return this.setState({ activePath: i});
		
	}
	
	renderLegendPaths() {
		return this.state.paths.map((x, i) => <div key={i} className={"path"}>
			<span className={"shape"} style={{background: x.color}}/>
			<span>Path {i+1}</span>
			<button className={["selector", this.state.activePath === i ? "active" : null].join(" ")} onClick={() => this.handlePathSelected(i)}><span>&times;</span></button>
		</div>);
	}
	
	renderPreviews() {
		if (this.state.previewUsers.length < 1) return null;
		return <div className="previews">
			{this.state.previewUsers.length === 1 ? <ProfilePreviewer user={this.state.previewUsers[0]}/> : <Fragment>
				<ProfilePreviewer user={this.state.previewUsers[0]}/>
				<ProfilePreviewer user={this.state.previewUsers[1]}/>
			</Fragment>}
		</div>;
	}
	
	renderHeader() {
		let text;
		if (this.state.minHops > 3) {
			text = `There are ${this.state.minHops - 2} hops`;
		} else if (this.state.minHops === 3) {
			text = "There is only a hop";
		} else {
			text = "There are no hops";
		}
		return text;
	}
	
	
	render() {
		if (this.state.redirecting) {
			this.props.history.push(this.destinationHref);
			return <Redirect to={this.destinationHref}/>;
		}
		const { highlightLink } = this.state;
		return <div className={"shortest-path"}>
			{this.state.nodes.length > 0 ? <Fragment>
				<div className={"header"}>
					<h3>
						{this.renderHeader()} between <b>you</b> and <b>{this.props.match.params.userName}</b>
					</h3>
				</div>
				<ForceGraph2D
					graphData={{
						nodes: this.state.nodes,
						links: this.state.links
					}}
					ref={el => { this.fg = el; }}
					nodeRelSize={this.radius}
					linkWidth={link => {
						if (this.state.activePath === null) {
							return link === highlightLink ? 4 : 2;
						}
						const { path } = link;
						return (path === this.state.activePath) ? 4 : 0.1;
					}}
					linkDirectionalParticles={4}
					linkDirectionalParticleWidth={link => link === highlightLink ? 4 : 0}
					nodeCanvasObject={this._paintNode}
					onNodeHover={this._handleNodeHover}
					onLinkHover={this._handleLinkHover}
					onNodeClick={this.handleClick}
				/>
				<div className={"legend"}>
					<h5>Legend</h5>
					<ul className={"paths"}>{this.renderLegendPaths()}</ul>
				</div>
				{this.state.previewUsers && this.renderPreviews()}
			</Fragment> : <div className={"header"}>
				<h3>There are no connections with this user</h3>
				<NavLink to={"/"} onClick={e => {
					e.preventDefault();
					this.props.history.goBack();
				}}>Go Back</NavLink>
			</div>
			}
		</div>;
	}
}

ShortestPath.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			userName: PropTypes.string.isRequired
		}).isRequired
	}).isRequired,
	user: PropTypes.shape({
		userName: PropTypes.string
	}).isRequired,
	history: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(ShortestPath);
