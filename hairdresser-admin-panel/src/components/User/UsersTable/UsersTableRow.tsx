import React from "react";
import User from "../../../types/User.ts";

interface UsersTableRowProps {
	user: User;
	deleteUser: (user: User) => void;
}

const UsersTableRow: React.FC<UsersTableRowProps> = ({user, deleteUser}) => {
	function handleDeleteClick() {
		if (confirm("Are you sure?")) {
			deleteUser(user);
		}
	}

	return (
		<>
			<tr>
				<td>{user.ID}</td>
				<td>{user.username}</td>
				<td>{user.name}</td>
				<td>{user.userType.charAt(0) + user.userType.slice(1).toLowerCase()}</td>
				<td>{user.notificationToken}</td>
				<td className={"text-end"}>
					<button className={"btn btn-sm btn-primary me-2"}><i className={"bi-list"}></i></button>
					<button className={"btn btn-sm btn-warning me-2"}><i className={"bi-pencil"}></i></button>
					<button className={"btn btn-sm btn-danger me-2"} onClick={handleDeleteClick}><i className={"bi-trash"}></i></button>
				</td>
			</tr>
		</>
	)
}

export default UsersTableRow;
