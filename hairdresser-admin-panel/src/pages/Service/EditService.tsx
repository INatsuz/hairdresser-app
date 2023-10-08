import React from 'react'
import Navbar from "../../components/Navbar/Navbar.tsx";
import AuthRequired from "../../components/Auth/AuthRequired.tsx";
import ServiceEditForm from "../../components/Service/ServiceEditForm/ServiceEditForm.tsx";

const EditService: React.FC = () => {

	return (
		<>
			<Navbar/>
			<AuthRequired>
				<div className={"container py-4"}>
					<h4>Edit Service</h4>
					<ServiceEditForm/>
				</div>
			</AuthRequired>
		</>
	)
}

export default EditService
