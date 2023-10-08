import React from 'react'
import Navbar from "../../components/Navbar/Navbar.tsx";
import AuthRequired from "../../components/Auth/AuthRequired.tsx";
import ClientsTable from "../../components/Client/ClientsTable/ClientsTable.tsx";
import useClients from "../../hooks/useClients.ts";
import {Link} from "react-router-dom";

const Clients: React.FC = () => {

	const [clients, setClients] = useClients();

	return (
		<>
			<Navbar/>
			<AuthRequired>
				<div className={"container py-4"}>
					<Link to={"create"}>
						<button className={"btn btn-success mb-2"}><i className="bi-plus-lg"></i> Create</button>
					</Link>
					<ClientsTable clients={clients} setClients={setClients}/>
				</div>
			</AuthRequired>
		</>
	)
}

export default Clients
