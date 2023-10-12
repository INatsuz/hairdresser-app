import React, {Dispatch, SetStateAction} from "react";
import ClientsTableRow from "./ClientsTableRow.tsx";
import Client from "../../../types/Client.ts";
import {deleteWithAuth} from "../../../utils/requester.ts";

interface ClientsTableProps {
	clients: Client[];
	setClients: Dispatch<SetStateAction<Client[]>>;
}

const ClientsTable: React.FC<ClientsTableProps> = ({clients, setClients}) => {
	function deleteClient(client: Client) {
		deleteWithAuth(`/api/deleteClient/${client.ID}`).then(() => {
			const newList: Client[] = clients.filter(cl => cl.ID !== client.ID);

			setClients(newList);
		});
	}

	return (
		<>
			<table className={"table table-striped table-hover"} data-testid={"clients-table"}>
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Phone</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{
						clients.map(client => <ClientsTableRow client={client} key={client.ID} deleteClient={deleteClient} />)
					}
				</tbody>
			</table>
		</>
	)
}

export default ClientsTable;
