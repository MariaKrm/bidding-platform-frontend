/* eslint-disable */

import { createStore } from "redux";
import rootReducer from "../reducers/index";

const store = createStore(rootReducer);

store.subscribe(() => {
	const storage = Object.assign({}, store.getState());
	console.log(storage);
	localStorage.setItem("redux_storage", JSON.stringify(storage));
});

export default store;
