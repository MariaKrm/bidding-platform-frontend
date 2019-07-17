import {
	REGISTER_TOKEN,
	ASSIGN_USER,
	RESET,
	STORE_FOLLOWERS,
	STORE_FOLLOWING,
	RELOAD_POSTS
} from "../constants/action-types";

const storage = localStorage.getItem("redux_storage");

const defaultState = { authToken: null, user: null, userFollowers: [], userFollowing: [], shouldReloadPosts: false };

const initialState = (storage === null) ? defaultState : Object.assign({}, defaultState, JSON.parse(storage));

function rootReducer(state = initialState, action) {
	switch (action.type) {
	case ASSIGN_USER:
		return Object.assign({}, state, {
			user: action.payload
		});
	case REGISTER_TOKEN:
		return Object.assign({}, state, {
			authToken: action.payload
		});
	case RESET:
		return Object.assign({}, defaultState);
	case STORE_FOLLOWERS:
		return Object.assign({}, state, {
			userFollowers: action.payload
		});
	case STORE_FOLLOWING:
		return Object.assign({}, state, {
			userFollowing: action.payload
		});
	case RELOAD_POSTS:
		return Object.assign({}, state, {
			shouldReloadPosts: action.payload
		});
	default:
		return state;
	}
}

export default rootReducer;
