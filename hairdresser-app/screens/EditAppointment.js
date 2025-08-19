import AppointmentForm from "../components/AppointmentForm/AppointmentForm";
import {deleteWithAuth, putWithAuth} from "../utils/Requester";

export default function EditAppointment({route, navigation}) {

	function onSave(appointment) {
		putWithAuth("api/editAppointment", {
			ID: appointment.ID,
			service: appointment.serviceID,
			client: appointment.clientID,
			assignedUser: appointment.assignedUser ? appointment.assignedUser : null,
			price: parseFloat(appointment.price) * 100,
			timeStart: appointment.timeStart.getTime(),
			timeEnd: appointment.timeEnd.getTime(),
			observations: appointment.observations.trim()
		}).then(() => {
			navigation.navigate("Home");
		});
	}

	function onDelete(id) {
		deleteWithAuth(`api/deleteAppointment/${id}`).then(() => {
			navigation.navigate("Home");
		}).catch(err => {
			console.log(err);
		});
	}

	return (
		<AppointmentForm data={route.params.data} onSubmit={onSave} onDelete={onDelete}/>
	);
};
