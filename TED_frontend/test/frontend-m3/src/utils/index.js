/* eslint-disable */

import axios from "axios";
import store from "../Redux/store";

const CONFIG = {
	APP_ID: '3X2Xsyrw7erR8wwB8aAX',
	APP_CODE: 'v1GrrQmdakHDamjzuZhy0w'
}

class AxiosRequest {
	static mergeHeaders(headers) {
		const authToken = store.getState().authToken;
		const authHeader = (authToken) ? { Authorization: "Bearer "+authToken } : {};
		return Object.assign({}, authHeader, headers);
	}
	
	send(method, url, data, headers) {
		method = method.toUpperCase();
		console.log(`\nSending ${method} HTTP request to the following route: ${url}\n`);
		if (data) console.log("Following data will be sent:", data);
		if (headers) console.log("The following additional headers were specified:", headers);
		headers = AxiosRequest.mergeHeaders(headers);
		console.log("Using the following headers:", headers);
		return axios.request({
			url,
			method,
			baseURL: (url.includes("http")) ? "" : window.location.origin,
			headers,
			data,
		}).then(res => {
			console.log("\nReceived the following response from "+res.request.responseURL+":", res, "\n");
			return res;
		}).catch(err => {
			console.error(err.response.data);
			throw err;
		});
	}
}

export const request = new AxiosRequest();

export function parseQuery(query) {
	const data = query.slice(1).split("&");
	const result = {};
	data.forEach(tuple => {
		const [key, value] = tuple.split("=");
		result[key] = decodeURIComponent(value);
	});
	return result;
}

export function getPosition(options) {
	return new Promise(function (resolve, reject) {
		navigator.geolocation.getCurrentPosition(resolve, reject, options);
	});
}

function parseLocationResult(result) {
	return ({
		title: result.title,
		id: result.id,
		position: result.position,
		category: result.category.id,
		distance: result.distance
	})
}

export function queryLocation(location) {
	return getPosition().then(position => {
		return request.send("GET", `https://places.cit.api.here.com/places/v1/discover/search?app_id=${CONFIG.APP_ID}&app_code=${CONFIG.APP_CODE}&at=${position.coords.latitude},${position.coords.longitude}&q=${location}`
		).then(res => res.data).then(data => data.results.items.map(result => parseLocationResult(result)));
	});
}

export function queryNearbyLocations() {
	return getPosition().then(position => {
		return request.send("GET", `https://places.cit.api.here.com/places/v1/browse?app_id=${CONFIG.APP_ID}&app_code=${CONFIG.APP_CODE}&in=${position.coords.latitude},${position.coords.longitude};r=500&pretty`)
			.then(res => res.data).then(data => data.results.items.map(result => parseLocationResult(result)));
	});
}

export function capitalize(string) {
	if (!string || string.length === 0) return;
	return string[0].toUpperCase() + string.slice(1);
}
