import React from 'react'
import Navbar from "../../components/Navbar/Navbar.tsx";
import AuthRequired from "../../components/Auth/AuthRequired.tsx";
import AppointmentEditForm from "../../components/Appointment/AppointmentEditForm/AppointmentEditForm.tsx";

const EditAppointment: React.FC = () => {

	return (
		<>
			<Navbar/>
			<AuthRequired>
				<div className={"container py-4"}>
					<h4>Editar Marcação</h4>
					<AppointmentEditForm/>
				</div>
			</AuthRequired>
		</>
	)
}

export default EditAppointment
