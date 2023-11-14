import {Agenda} from "react-native-calendars";
import useAppointments from "../../hooks/useAppointments";
import {Alert, TouchableOpacity, View, StyleSheet, Text} from "react-native";

export default function AppointmentAgenda() {

	const [appointments] = useAppointments();

	function convertAppointmentsToAgendaItems(appointments) {
		const agendaItems = {};

		appointments.forEach(ap => {
			const startDate = `${ap.timeStart.getFullYear()}-${String(ap.timeStart.getMonth() + 1).padStart(2, "0")}-${String(ap.timeStart.getDate()).padStart(2, "0")}`;

			if (agendaItems[startDate]) {
				agendaItems[startDate].push(
					{
						name: `${ap.clientName} - ${ap.serviceName}`
					}
				);
			} else {
				agendaItems[startDate] = [
					{
						name: `${ap.clientName} - ${ap.serviceName}`
					}
				];
			}
		});

		console.log(agendaItems);
		return agendaItems;
	}

	const renderItem = (reservation, isFirst) => {
		const fontSize = isFirst ? 16 : 14;
		const color = isFirst ? 'black' : '#43515c';

		return (
			<TouchableOpacity
				style={[styles.item, {height: reservation.height}]}
				onPress={() => Alert.alert(reservation.name)}
			>
				<Text style={{fontSize, color}}>{reservation.name}</Text>
			</TouchableOpacity>
		);
	};

	return (
		<>
			<Agenda
				items={convertAppointmentsToAgendaItems(appointments)}
				showOnlySelectedDayItems={true}
				renderItem={renderItem}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	item: {
		backgroundColor: 'white',
		flex: 1,
		borderRadius: 5,
		padding: 10,
		marginRight: 10,
		marginTop: 17
	},
	emptyDate: {
		height: 15,
		flex: 1,
		paddingTop: 30
	},
	customDay: {
		margin: 10,
		fontSize: 24,
		color: 'green'
	},
	dayItem: {
		marginLeft: 34
	}
});