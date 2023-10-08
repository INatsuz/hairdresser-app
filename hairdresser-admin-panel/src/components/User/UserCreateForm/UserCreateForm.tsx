import React, {useState} from 'react'
import {useNavigate} from "react-router-dom";
import {postWithAuth} from "../../../utils/requester.ts";
import {UserType} from "../../../types/User.ts";

const UserCreateForm: React.FC = () => {

	const navigate = useNavigate();

	const USER_TYPES: string[] = Object.keys(UserType);

	const [username, setUsername] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [userType, setUserType] = useState<UserType>(USER_TYPES[0] as UserType);

	const [showPassword, setShowPassword] = useState<boolean>(false)

	function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
		// Cancelling the submit event so page won't reload
		e.preventDefault();

		if (!name || name.trim() === "") {
			return;
		}

		if (!username || username.trim() === "" || username.length < 4) {
			return;
		}

		if (!password || password.trim() === "" || password.trim().length < 6) {
			return;
		}

		if (confirmPassword !== password) {
			return;
		}

		if (!Object.values(UserType).includes(userType)) {
			return;
		}

		postWithAuth("/users/register", {
			username: username.trim(),
			name: name.trim(),
			password: password.trim(),
			userType: userType
		}).then(() => {
			navigate("/users");
		});

	}

	return (
		<>
			<form className={"bg-light rounded p-3 shadow"} onSubmit={handleSubmit}>
				<div className={"mb-3"}>
					<label htmlFor="username" className="form-label">Username</label>
					<input type="text" id={"username"} value={username} name={"username"} className={"form-control"} onChange={e => setUsername(e.target.value)}/>
					{
						username.trim() === "" &&
						<div className="alert alert-danger p-2 mt-2" role={"alert"}>
							This field cannot be left empty.
						</div>
					}
					{
						username.trim().length > 0 && username.trim().length < 4 &&
						<div className="alert alert-danger p-2 mt-2" role={"alert"}>
							Username must be at least 4 characters long.
						</div>
					}
				</div>
				<div className={"mb-3"}>
					<label htmlFor="name" className="form-label">Name</label>
					<input type="text" id={"name"} value={name} name={"name"} className={"form-control"} onChange={e => setName(e.target.value)}/>
					{
						name.trim() === "" &&
						<div className="alert alert-danger p-2 mt-2" role={"alert"}>
							This field cannot be left empty.
						</div>
					}
				</div>
				<div className={"mb-3"}>
					<label htmlFor="password" className="form-label">Password</label>
					<div className="input-group">
						<input type={showPassword ? "text" : "password"} id={"password"} value={password} name={"password"} className={"form-control"} onChange={e => setPassword(e.target.value)}/>
						<button type={"button"} className={"btn text-dark btn-outline-light"} onClick={() => setShowPassword(!showPassword)}>
							<i className={"bi bi-eye-slash-fill"}></i>
						</button>
					</div>
					{
						password.trim().length === 0 &&
						<div className="alert alert-danger p-2 mt-2" role={"alert"}>
							The password cannot be left empty.
						</div>
					}
					{
						password.trim().length > 0 && password.trim().length < 6 &&
						<div className="alert alert-danger p-2 mt-2" role={"alert"}>
							The password must be at least 6 characters long.
						</div>
					}
				</div>
				<div className={"mb-3"}>
					<label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
					<input type="password" id={"confirmPassword"} value={confirmPassword} name={"confirmPassword"} className={"form-control"} onChange={e => setConfirmPassword(e.target.value)}/>
					{
						confirmPassword !== password &&
						<div className="alert alert-danger p-2 mt-2" role={"alert"}>
							The passwords don't match.
						</div>
					}
				</div>
				<div className={"mb-3"}>
					<label htmlFor="userType" className="form-label">User Type</label>
					<select value={userType} name="userType" id="userType" className={"form-select"} onChange={e => setUserType(e.target.value as UserType)}>
						{
							USER_TYPES.map(value =>
								<option value={value} key={value}>{value.charAt(0) + value.slice(1).toLowerCase()}</option>)
						}
					</select>
				</div>
				<div>
					<button type={"submit"} className="btn btn-success">Create</button>
				</div>
			</form>
		</>
	);
}

export default UserCreateForm
