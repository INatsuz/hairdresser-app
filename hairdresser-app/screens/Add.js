import AppointmentForm from "../components/AppointmentForm/AppointmentForm";
import {postWithAuth} from "../utils/Requester";

export default function Add({route: {params}, navigation}) {

	function onSavePress(appointment) {
		postWithAuth("api/addAppointment", {
			service: appointment.serviceID,
			client: appointment.clientID,
			assignedUser: appointment.assignedUser ? appointment.assignedUser : null,
			price: appointment.price * 100,
			timeStart: `${appointment.timeStart.getUTCFullYear()}-${appointment.timeStart.getUTCMonth() + 1}-${appointment.timeStart.getUTCDate()} ${appointment.timeStart.getUTCHours()}:${appointment.timeStart.getUTCMinutes()}:00`,
			timeEnd: `${appointment.timeEnd.getUTCFullYear()}-${appointment.timeEnd.getUTCMonth() + 1}-${appointment.timeEnd.getUTCDate()} ${appointment.timeEnd.getUTCHours()}:${appointment.timeEnd.getUTCMinutes()}:00`,
			observations: appointment.observations.trim()
		}).then(() => {
			navigation.navigate("Home");
		});
	}

	return (
		<AppointmentForm onSubmit={onSavePress}/>
	);
};
