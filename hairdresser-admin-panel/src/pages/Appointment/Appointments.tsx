import React from 'react'
import Navbar from "../../components/Navbar/Navbar.tsx";
import AppointmentsTable from "../../components/Appointment/AppointmentsTable/AppointmentsTable.tsx";
import useAppointments from "../../hooks/useAppointments.ts";
import AuthRequired from "../../components/Auth/AuthRequired.tsx";
import {Link} from "react-router-dom";

const Appointments: React.FC = () => {

	const [appointments, setAppointments] = useAppointments();

	return (
		<>
			<Navbar/>
			<AuthRequired>
				<div className={"container py-4"}>
					<Link to={"create"}>
						<button className={"btn btn-success mb-2"}><i className="bi-plus-lg"></i> Novo</button>
					</Link>
					<AppointmentsTable appointments={appointments} setAppointments={setAppointments}/>
				</div>
			</AuthRequired>
		</>
	)
}

export default Appointments
