import axios from "axios";

const API_URL = "https://dev.vraminhos.com"
axios.defaults.withCredentials = true;

export function getWithAuth(url: string): Promise<any> {
	return new Promise((resolve, reject) => {
		axios.get(`${API_URL}${url}`).then(res => {
			resolve(res);
		}).catch(err => {
			reject(err);
		});
	})
}

export function postWithAuth(url: string, data: object): Promise<any> {
	return new Promise((resolve, reject) => {
		axios.post(`${API_URL}${url}`, data).then(res => {
			resolve(res);
		}).catch(err => {
			reject(err);
		});
	})
}

export function putWithAuth(url: string, data: object): Promise<any> {
	return new Promise((resolve, reject) => {
		axios.put(`${API_URL}${url}`, data).then(res => {
			resolve(res);
		}).catch(err => {
			reject(err);
		});
	})
}

export function deleteWithAuth(url: string): Promise<any> {
	return new Promise((resolve, reject) => {
		axios.delete(`${API_URL}${url}`).then(res => {
			resolve(res);
		}).catch(err => {
			reject(err);
		});
	})
}