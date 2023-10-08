import React from "react";
import Client from "../../../types/Client.ts";
import {useNavigate} from "react-router-dom";

interface ClientsTableRowProps {
	client: Client;
	deleteClient: (cl: Client) => void;
}

const ClientsTableRow: React.FC<ClientsTableRowProps> = ({client, deleteClient}) => {
	const navigate = useNavigate();

	function handleDeleteClick() {
		if (confirm("Are you sure?")) {
			deleteClient(client);
		}
	}

	function handleEditClick() {
		navigate("edit", {
			state: {
				client: client
			}
		});
	}

	return (
		<>
			<tr>
				<td>{client.ID}</td>
				<td>{client.name}</td>
				<td>{client.phone}</td>
				<td className={"text-end"}>
					<button className={"btn btn-sm btn-primary me-2"}><i className={"bi-list"}></i></button>
					<button className={"btn btn-sm btn-warning me-2"} onClick={handleEditClick}><i className={"bi-pencil"}></i>
					</button>
					<button className={"btn btn-sm btn-danger me-2"} onClick={handleDeleteClick}>
						<i className={"bi-trash"}></i></button>
				</td>
			</tr>
		</>
	)
}

export default ClientsTableRow;
