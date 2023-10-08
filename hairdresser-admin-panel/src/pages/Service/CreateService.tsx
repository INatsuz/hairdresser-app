import React from 'react'
import Navbar from "../../components/Navbar/Navbar.tsx";
import AuthRequired from "../../components/Auth/AuthRequired.tsx";
import ServiceCreateForm from "../../components/Service/ServiceCreateForm/ServiceCreateForm.tsx";

const CreateService: React.FC = () => {

	return (
		<>
			<Navbar/>
			<AuthRequired>
				<div className={"container py-4"}>
					<h4>Create New Service</h4>
					<ServiceCreateForm/>
				</div>
			</AuthRequired>
		</>
	)
}

export default CreateService
