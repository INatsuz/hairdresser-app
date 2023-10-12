import {getWithAuth, postWithAuth} from "../utils/requester.ts";
import {useDispatch} from "react-redux";
import {login as reduxLogin, logout as reduxLogout} from "../redux/sessionSlice.ts";
import {UserType} from "../types/User.ts";

export default function useLogin() {
	const dispatch = useDispatch();

	function checkLogin(): void {
		getWithAuth("/users/checkLogin").then(res => {
			console.log(res.data);
			const isLoggedIn: boolean = res.data.loggedIn;

			if (isLoggedIn) {
				dispatch(reduxLogin(res.data.user));
			} else {
				dispatch(reduxLogout());
			}
		}).catch(err => {
			console.log(err);
			dispatch(reduxLogout());
		});
	}

	function login(username: string, password: string): Promise<boolean> {
		return postWithAuth("/users/login", {username, password}).then(res => {
			console.log(res.data);
			const accessToken: string = res.data.accessToken;

			if (accessToken && res.data.user.userType === UserType.ADMIN) {
				dispatch(reduxLogin(res.data.user));
			} else {
				dispatch(reduxLogout());
			}

			return true;
		}).catch(err => {
			console.log(err);
			dispatch(reduxLogout());

			throw err;
		});
	}

	function logout(): Promise<boolean> {
		return getWithAuth("/users/logout").then(res => {
			console.log(res.data);
			const isLoggedIn: boolean = res.data.loggedIn;

			if (!isLoggedIn) {
				dispatch(reduxLogout());
				return true;
			}

			return false;
		}).catch(err => {
			console.log(err);
			return false;
		});
	}

	return [login, checkLogin, logout] as const;
}