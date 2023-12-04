import {useDispatch} from "react-redux";
import {getWithAuth, post, postWithAuth} from "../utils/Requester";
import {deleteTokens, getTokens, saveTokens} from "../utils/TokenManager";
import {login as loginAction, logout as logoutAction} from "../redux/sessionSlice";

export default function useLogin() {

	const dispatch = useDispatch();

	function login(username, password) {
		post("users/login", {username: username, password: password}).then(res => {
			if (res.data.accessToken && res.data.refreshToken) {
				saveTokens({accessToken: res.data.accessToken, refreshToken: res.data.refreshToken});
				dispatch(loginAction(res.data.user));
			} else {
				deleteTokens();
			}
		}).catch(err => {
			console.log(err);
			deleteTokens();
		});
	}

	function checkLogin() {
		getTokens().then(({accessToken, refreshToken}) => {
			getWithAuth("users/checkLogin").then(res => {
				dispatch(loginAction(res.data.user));
			}).catch(err => {
				console.log(err);
				dispatch(logoutAction());
			});
		}).catch(err => {
			console.log(err);
			dispatch(logoutAction());
		})
	}

	return [checkLogin, login];
};
