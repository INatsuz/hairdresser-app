import React, {useState} from 'react'
import Navbar from "../components/Navbar/Navbar.tsx";
import useLogin from "../hooks/useLogin.ts";
import {useNavigate} from "react-router-dom";

const Login: React.FC = () => {

	const [login] = useLogin();
	const navigate = useNavigate();

	const [failedLogin, setFailedLogin] = useState<boolean>(false);

	function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
		// Cancelling the submit event so page won't reload
		e.preventDefault();

		// Getting the form data from the input fields
		// Doing it this way prevents having to do active inputs and creating state variables
		// which saves on re-renders and improves performance
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		const username: string = formData.get("username") as string;
		const password: string = formData.get("password") as string;

		// Try to log in using the username and password received from the form inputs
		login(username, password).then(res => {
			if (res) {
				navigate(`/appointments`);
			}
		}).catch(() => {
			setFailedLogin(true);
		});
	}

	return (
		<>
			<Navbar/>
			<div className={"container py-5"}>
				{
					failedLogin &&
					<div className={"alert alert-danger"} data-testid={"failed-login-alert"}>
						Failed to login. Please check your credentials and try again.
					</div>
				}
				<form className={"bg-light rounded p-3 shadow"} data-testid={"login-form"} onSubmit={handleSubmit}>
					<div className={"mb-3"}>
						<label htmlFor="username" className="form-label" data-testid={"username-label"}>Username</label>
						<input type="text" className="form-control" name="username" id={"username"} data-testid={"username-input"}/>
					</div>
					<div className={"mb-3"}>
						<label htmlFor="password" className="form-label" data-testid={"password-label"}>Password</label>
						<input type="password" className="form-control" name="password" id={"password"} data-testid={"password-input"}/>
					</div>
					<div>
						<button type={"submit"} className="btn btn-primary" data-testid={"login-submit-btn"}>Login</button>
					</div>
				</form>
			</div>
		</>
	)
}

export default Login
