import React from 'react'
import {NavLink, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import useLogin from "../../hooks/useLogin.ts";

const Home: React.FC = () => {
	const navigate = useNavigate();

	const {loggedIn, user} = useSelector((state: RootState) => state.session);
	const [, , logout] = useLogin();

	function handleLogout() {
		logout().then(res => {
			if (res) {
				navigate("/login");
			}
		});
	}

	return (
		<>
			<nav className="navbar navbar-expand-lg bg-light shadow" data-bs-theme="light">
				<div className="container">
					<a className="navbar-brand">Hairdresser App</a>
					<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarNav">
						<ul className="navbar-nav">
							<li className="nav-item">
								<NavLink className={`nav-link ${loggedIn ? "" : "disabled"}`} to={"/appointments"} data-testid={"nav-appointments-link"}>Appointments</NavLink>
							</li>
							<li className="nav-item">
								<NavLink className={`nav-link ${loggedIn ? "" : "disabled"}`} to={"/clients"} data-testid={"nav-clients-link"}>Clients</NavLink>
							</li>
							<li className="nav-item">
								<NavLink className={`nav-link ${loggedIn ? "" : "disabled"}`} to={"/services"} data-testid={"nav-services-link"}>Services</NavLink>
							</li>
							<li className="nav-item">
								<NavLink className={`nav-link ${loggedIn ? "" : "disabled"}`} to={"/users"} data-testid={"nav-users-link"}>Users</NavLink>
							</li>
						</ul>
						<ul className="navbar-nav ms-auto">
							{
								loggedIn &&
								<li className="nav-item">
									<a href={"#"} className={"nav-link active"} data-testid={"nav-username-link"}>{user.username}</a>
								</li>
							}
							<li className="nav-item">
								{
									!loggedIn ?
										<NavLink className="nav-link active" to={"/login"} data-testid={"nav-login-link"}>Login</NavLink>
										:
										<a href={"#"} className={"nav-link active"} onClick={handleLogout} data-testid={"nav-logout-link"}>Logout</a>
								}
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</>
	)
}

export default Home
