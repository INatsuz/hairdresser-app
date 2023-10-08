import React from 'react'
import Navbar from "../../components/Navbar/Navbar.tsx";
import AuthRequired from "../../components/Auth/AuthRequired.tsx";
import ClientEditForm from "../../components/Client/ClientEditForm/ClientEditForm.tsx";

const EditClient: React.FC = () => {

	return (
		<>
			<Navbar/>
			<AuthRequired>
				<div className={"container py-4"}>
					<h4>Edit Client</h4>
					<ClientEditForm/>
				</div>
			</AuthRequired>
		</>
	)
}

export default EditClient
