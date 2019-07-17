import React, { Component } from "react";
import {
	Route,
	BrowserRouter,
	Switch
} from "react-router-dom";
import { Redirect } from "react-router";
import { createBrowserHistory } from "history";
import Navbar from "./Navbar";
import Feed from "./Feed";
import Profile from "./Profile";
import Verification from "./Verification";
import Login from "./Login";
import Signup from "./Signup";
import Reset from "./Reset";
import Settings from "./Settings";
import Hashtag from "./Hashtag";
import Location from "./Location";
import GeoMap from "./GeoMap";
import Logout from "./Logout";
import FriendLists from "./FriendLists";
import BlockedList from "./BlockedList";
import ChatPage from "./Chat";
import ShortestPath from "./ShortestPath";
import Statistics from "./Statistics";
import AdminPage from "./Admin";

import PropTypes from "prop-types";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({ user: state.user });

class ConnectedApp extends Component {
	constructor(props) {
		super(props);
		this.redirectToProfile = this.redirectToProfile.bind(this);
		this.redirectToLogin = this.redirectToLogin.bind(this);
		this.redirect = this.redirect.bind(this);
	}
	
	redirect(path) {
		return (path) ? <Redirect to={path}/> : <Redirect to={"/"}/>;
	}
	
	redirectToProfile() {
		const { user } = this.props;
		return this.redirect(`/profile/${user.userName}`);
	}
	
	redirectToLogin() {
		return this.redirect("/login");
	}
	
	renderAuthRoutes() {
		return <Switch>
			<Route path="/feed" component={Feed}/>
			<Route path="/profile/:username" component={Profile}/>
			<Route path="/settings" component={Settings}/>
			<Route path="/verification" component={Verification}/>
			<Route path="/signup" component={Signup}/>
			<Route exact path="/geomap" render={() => <Redirect to={`/geomap/${this.props.user.userName}`}/>}/>
			<Route path="/geomap/:userName" component={GeoMap}/>
			<Route path="/hashtag" component={Hashtag}/>
			<Route path="/location" component={Location}/>
			<Route path="/lists" component={FriendLists}/>
			<Route path="/blocked" component={BlockedList}/>
			<Route path="/statistics" component={Statistics}/>
			<Route exact path={["/","/profile"]} render={this.redirectToProfile}/>
			<Route path="/admin" component={AdminPage}/>
			<Route path={["/messages/:userName", "/messages"]} component={ChatPage}/>
			<Route path="/shortestPath/:userName" component={ShortestPath}/>
			<Route render={this.redirectToProfile}/>
		</Switch>;
	}
	
	renderNonAuthRoutes() {
		return <Switch>
			<Route path="/login" component={Login}/>
			<Route path="/signup" component={Signup}/>
			<Route path="/reset" component={Reset}/>
			<Route path="/verification" component={Verification}/>
			<Route render={this.redirectToLogin}/>
		</Switch>;
	}
	
	render() {
		const { user } = this.props;
		return (
			<BrowserRouter history={createBrowserHistory()}>
				<div className='app'>
					<Navbar/>
					<div className='content'>
						{user ? this.renderAuthRoutes() : this.renderNonAuthRoutes()}
						<Route path={"/logout"} component={Logout}/>
					</div>
				</div>
			</BrowserRouter>
		);
	}
}

ConnectedApp.propTypes = {
	user: PropTypes.object
};

const App = connect(mapStateToProps)(ConnectedApp);

export default App;
