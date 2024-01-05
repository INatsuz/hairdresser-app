import React from 'react'
import Navbar from "../../components/Navbar/Navbar.tsx";
import AuthRequired from "../../components/Auth/AuthRequired.tsx";
import UsersTable from "../../components/User/UsersTable/UsersTable.tsx";
import useUsers from "../../hooks/useUsers.ts";
import {Link} from "react-router-dom";

const Users: React.FC = () => {

	const [users, setUsers] = useUsers();

	return (
		<>
			<Navbar/>
			<AuthRequired>
				<div className="container py-4">
					<Link to={"create"}>
						<button className={"btn btn-success mb-2"}><i className="bi-plus-lg"></i> Novo</button>
					</Link>
					<UsersTable users={users} setUsers={setUsers}/>
				</div>
			</AuthRequired>
		</>
	)
}

export default Users
