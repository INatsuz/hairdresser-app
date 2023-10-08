import React from 'react'
import {NavLink} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import useLogin from "../../hooks/useLogin.ts";

const Home: React.FC = () => {
	const {loggedIn, user} = useSelector((state: RootState) => state.session);
	const [, , logout] = useLogin();

	function handleLogout() {
		logout();
	}

	return (
		<>
			<nav className="navbar navbar-expand-lg bg-light shadow" data-bs-theme="light">
				<div className="container">
					<a className="navbar-brand" href="#">Hairdresser App</a>
					<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarNav">
						<ul className="navbar-nav">
							<li className="nav-item">
								<NavLink className={`nav-link ${loggedIn ? "" : "disabled"}`} to={"/appointments"}>Appointments</NavLink>
							</li>
							<li className="nav-item">
								<NavLink className={`nav-link ${loggedIn ? "" : "disabled"}`} to={"/clients"}>Clients</NavLink>
							</li>
							<li className="nav-item">
								<NavLink className={`nav-link ${loggedIn ? "" : "disabled"}`} to={"/services"}>Services</NavLink>
							</li>
							<li className="nav-item">
								<NavLink className={`nav-link ${loggedIn ? "" : "disabled"}`} to={"/users"}>Users</NavLink>
							</li>
						</ul>
						<ul className="navbar-nav ms-auto">
							{
								loggedIn &&
								<li className="nav-item">
									<a href={"#"} className={"nav-link active"}>{user.username}</a>
								</li>
							}
							<li className="nav-item">
								{
									!loggedIn ?
										<NavLink className="nav-link active" to={"/login"}>Login</NavLink>
										:
										<a href={"#"} className={"nav-link active"} onClick={handleLogout}>Logout</a>
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
