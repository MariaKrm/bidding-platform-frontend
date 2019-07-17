import {
	REGISTER_TOKEN,
	ASSIGN_USER,
	RESET,
	STORE_FOLLOWERS,
	STORE_FOLLOWING,
	RELOAD_POSTS
} from "../constants/action-types";

export function registerToken(payload) {
	return { type: REGISTER_TOKEN, payload };
}

export function assignUser(payload) {
	return { type: ASSIGN_USER, payload };
}

export function reset() {
	return { type: RESET, payload: null };
}

export function storeFollowers(payload) {
	return { type: STORE_FOLLOWERS, payload };
}

export function storeFollowing(payload) {
	return { type: STORE_FOLLOWING, payload };
}

export function reloadPosts(payload) {
	return { type: RELOAD_POSTS, payload };
}
