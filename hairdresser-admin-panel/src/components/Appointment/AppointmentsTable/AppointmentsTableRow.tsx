import React from "react";
import Appointment from "../../../types/Appointment.ts";
import {useNavigate} from "react-router-dom";

interface AppointmentsTableRowProps {
	appointment: Appointment;
	deleteAppointment: (ap: Appointment) => void;
}

const AppointmentsTableRow: React.FC<AppointmentsTableRowProps> = ({appointment, deleteAppointment}) => {

	const navigate = useNavigate();

	function handleDeleteClick() {
		if (confirm("Are you sure?")) {
			deleteAppointment(appointment);
		}
	}

	function handleEditClick() {
		navigate("edit", {
			state: {
				appointment: appointment
			}
		});
	}

	return (
		<>
			<tr>
				<td>{appointment.ID}</td>
				<td>{appointment.serviceName}</td>
				<td>{appointment.clientName}</td>
				<td>{appointment.assignedUserName}</td>
				<td>€{(appointment.price / 100).toFixed(2)}</td>
				<td>{`${appointment.timeStart.getDate().toString().padStart(2, '0')}/${(appointment.timeStart.getMonth() + 1).toString().padStart(2, '0')}/${appointment.timeStart.getFullYear()} - ${appointment.timeStart.getHours().toString().padStart(2, '0')}:${appointment.timeStart.getMinutes().toString().padStart(2, '0')}`}</td>
				<td>{`${appointment.timeEnd.getDate().toString().padStart(2, '0')}/${(appointment.timeEnd.getMonth() + 1).toString().padStart(2, '0')}/${appointment.timeEnd.getFullYear()} - ${appointment.timeEnd.getHours().toString().padStart(2, '0')}:${appointment.timeEnd.getMinutes().toString().padStart(2, '0')}`}</td>
				<td className={"text-end"}>
					<button className={"btn btn-sm btn-primary me-2"}><i className={"bi-list"}></i></button>
					<button className={"btn btn-sm btn-warning me-2"}><i className={"bi-pencil"} onClick={handleEditClick}></i></button>
					<button className={"btn btn-sm btn-danger me-2"} onClick={handleDeleteClick}>
						<i className={"bi-trash"}></i></button>
				</td>
			</tr>
		</>
	)
}

export default AppointmentsTableRow;
