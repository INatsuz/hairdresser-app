import React from 'react'
import Navbar from "../../components/Navbar/Navbar.tsx";
import AuthRequired from "../../components/Auth/AuthRequired.tsx";
import UserCreateForm from "../../components/User/UserCreateForm/UserCreateForm.tsx";

const CreateUser: React.FC = () => {

	return (
		<>
			<Navbar/>
			<AuthRequired>
				<div className={"container py-4"}>
					<h4>Create New User</h4>
					<UserCreateForm/>
				</div>
			</AuthRequired>
		</>
	)
}

export default CreateUser
