import React from 'react'
import Navbar from "../../components/Navbar/Navbar.tsx";
import AuthRequired from "../../components/Auth/AuthRequired.tsx";
import ClientCreateForm from "../../components/Client/ClientCreateForm/ClientCreateForm.tsx";

const CreateClient: React.FC = () => {

	return (
		<>
			<Navbar/>
			<AuthRequired>
				<div className={"container py-4"}>
					<h4>Novo Cliente</h4>
					<ClientCreateForm/>
				</div>
			</AuthRequired>
		</>
	)
}

export default CreateClient
