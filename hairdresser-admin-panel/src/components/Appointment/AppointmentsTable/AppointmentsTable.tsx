import React, {Dispatch, SetStateAction} from "react";
import Appointment from "../../../types/Appointment.ts";
import AppointmentsTableRow from "./AppointmentsTableRow.tsx";
import {deleteWithAuth} from "../../../utils/requester.ts";

interface AppointmentsTableProps {
	appointments: Appointment[];
	setAppointments: Dispatch<SetStateAction<Appointment[]>>;
}

const AppointmentsTable: React.FC<AppointmentsTableProps> = ({appointments, setAppointments}) => {
	function deleteAppointment(appointment: Appointment) {
		deleteWithAuth(`/api/deleteAppointment/${appointment.ID}`).then(() => {
			const newList: Appointment[] = appointments.filter(ap => ap.ID !== appointment.ID);

			setAppointments(newList);
		});
	}

	return (
		<>
			<table className={"table table-striped table-hover"} data-testid={"appointments-table"}>
				<thead>
					<tr>
						<th>ID</th>
						<th>Service</th>
						<th>Client</th>
						<th>Assigned User</th>
						<th>Price</th>
						<th>Time Start</th>
						<th>Time End</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{
						appointments.map(appointment => <AppointmentsTableRow appointment={appointment} key={appointment.ID} deleteAppointment={deleteAppointment} />)
					}
				</tbody>
			</table>
		</>
	)
}

export default AppointmentsTable;
