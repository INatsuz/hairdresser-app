import React from 'react'
import Navbar from "../../components/Navbar/Navbar.tsx";
import AuthRequired from "../../components/Auth/AuthRequired.tsx";
import AppointmentCreateForm from "../../components/Appointment/AppointmentCreateForm/AppointmentCreateForm.tsx";

const CreateAppointment: React.FC = () => {

	return (
		<>
			<Navbar/>
			<AuthRequired>
				<div className={"container py-4"}>
					<h4>Create New Appointment</h4>
					<AppointmentCreateForm/>
				</div>
			</AuthRequired>
		</>
	)
}

export default CreateAppointment
