import AppointmentForm from "../components/AppointmentForm/AppointmentForm";
import {postWithAuth} from "../utils/Requester";
import useAppointments from "../hooks/useAppointments";
import {Alert} from "react-native";

export default function AddAppointment({route: {params}, navigation}) {

	const APPOINTMENT_LIMIT = process.env.EXPO_PUBLIC_APPOINTMENT_LIMIT ?? process.env.EXPO_PUBLIC_DEV_APPOINTMENT_LIMIT;

	const [appointments, ,] = useAppointments();

	function onSavePress(appointment) {
		const conflicting_appointments = appointments.filter(ap => ap.timeStart.getTime() === appointment.timeStart.getTime());
		if (conflicting_appointments.length >= APPOINTMENT_LIMIT) {
			Alert.alert(
				"Confirmar",
				`Já estão marcadas ${conflicting_appointments.length} sessões para esta hora. Quer adicionar mais uma?`,
				[
					{
						text: "Sim",
						onPress: () => {
							postWithAuth("api/addAppointment", {
								service: appointment.serviceID,
								client: appointment.clientID,
								assignedUser: appointment.assignedUser ? appointment.assignedUser : null,
								price: parseFloat(appointment.price) * 100,
								timeStart: `${appointment.timeStart.getUTCFullYear()}-${appointment.timeStart.getUTCMonth() + 1}-${appointment.timeStart.getUTCDate()} ${appointment.timeStart.getUTCHours()}:${appointment.timeStart.getUTCMinutes()}:00`,
								timeEnd: `${appointment.timeEnd.getUTCFullYear()}-${appointment.timeEnd.getUTCMonth() + 1}-${appointment.timeEnd.getUTCDate()} ${appointment.timeEnd.getUTCHours()}:${appointment.timeEnd.getUTCMinutes()}:00`,
								observations: appointment.observations.trim()
							}).then(() => {
								navigation.navigate("Home");
							});
						}
					},
					{
						text: "Cancelar",
						style: "cancel"
					}
				]
			);
		} else {
			postWithAuth("api/addAppointment", {
				service: appointment.serviceID,
				client: appointment.clientID,
				assignedUser: appointment.assignedUser ? appointment.assignedUser : null,
				price: parseFloat(appointment.price) * 100,
				timeStart: `${appointment.timeStart.getUTCFullYear()}-${appointment.timeStart.getUTCMonth() + 1}-${appointment.timeStart.getUTCDate()} ${appointment.timeStart.getUTCHours()}:${appointment.timeStart.getUTCMinutes()}:00`,
				timeEnd: `${appointment.timeEnd.getUTCFullYear()}-${appointment.timeEnd.getUTCMonth() + 1}-${appointment.timeEnd.getUTCDate()} ${appointment.timeEnd.getUTCHours()}:${appointment.timeEnd.getUTCMinutes()}:00`,
				observations: appointment.observations.trim()
			}).then(() => {
				navigation.navigate("Home");
			});
		}
	}

	return (
		<AppointmentForm onSubmit={onSavePress}/>
	);
};
