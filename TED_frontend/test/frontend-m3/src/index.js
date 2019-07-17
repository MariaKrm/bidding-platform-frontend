import React from "react";
import ReactDOM from "react-dom";
import "./stylesheets/style.sass";

import App from "./app";
import { Provider } from "react-redux";
import store from "./Redux/store";


ReactDOM.render(
	<Provider store={store}>
		<App/>
	</Provider>,
	document.getElementById("root")
);
