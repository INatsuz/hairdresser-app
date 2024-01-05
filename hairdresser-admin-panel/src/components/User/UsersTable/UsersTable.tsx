import React from "react";
import UsersTableRow from "./UsersTableRow.tsx";
import User from "../../../types/User.ts";
import {deleteWithAuth} from "../../../utils/requester.ts";

interface UsersTableProps {
	users: User[];
	setUsers: React.Dispatch<React.SetStateAction<User[]>>
}

const UsersTable: React.FC<UsersTableProps> = ({users, setUsers}) => {
	function deleteUser(user: User) {
		deleteWithAuth(`/api/deleteUser/${user.ID}`).then(() => {
			const newList: User[] = users.filter(us => us.ID !== user.ID);

			setUsers(newList);
		});
	}

	return (
		<>
			<table className={"table table-striped table-hover"} data-testid={"users-table"}>
				<thead>
					<tr>
						<th>ID</th>
						<th>Username</th>
						<th>Nome</th>
						<th>Tipo de Utilizador</th>
						<th>Notification Token</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{
						users.map(user => <UsersTableRow user={user} key={user.ID} deleteUser={deleteUser}/>)
					}
				</tbody>
			</table>
		</>
	)
}

export default UsersTable;
