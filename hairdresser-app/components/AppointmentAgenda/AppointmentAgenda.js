import {Agenda} from "react-native-calendars";
import useAppointments from "../../hooks/useAppointments";
import {RefreshControl, StyleSheet, Text, TouchableOpacity} from "react-native";
import {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";

export default function AppointmentAgenda() {

	const [appointments, setAppointments, fetchAppointments] = useAppointments();

	const [isRefreshing, setIsRefreshing] = useState(false);

	const navigation = useNavigation();

	useEffect(() => {
		return navigation.addListener('focus', () => {
			fetchAppointments();
		});
	}, [navigation]);

	function handleRefresh() {
		setAppointments([]);
		setIsRefreshing(true);
		fetchAppointments().finally(() => {
			setIsRefreshing(false);
		});
	}

	function reservationsKeyExtractor(dayAgenda, index) {
		console.log(dayAgenda);
		return `${dayAgenda.reservation.ID}`;
	}

	function convertAppointmentsToAgendaItems(appointments) {
		const agendaItems = {};

		if (appointments.length > 0) {
			appointments.forEach(ap => {
				const startDate = `${ap.timeStart.getFullYear()}-${String(ap.timeStart.getMonth() + 1).padStart(2, "0")}-${String(ap.timeStart.getDate()).padStart(2, "0")}`;

				if (agendaItems[startDate]) {
					agendaItems[startDate].push(ap);
				} else {
					agendaItems[startDate] = [ap];
				}
			});
		}

		console.log(agendaItems);
		return agendaItems;
	}

	const renderItem = (reservation, isFirst) => {
		const fontSize = 16;

		return (
			<TouchableOpacity
				style={styles.item}
				onPress={() => {
					if (reservation && reservation.timeStart instanceof Date && reservation.timeEnd instanceof Date) {
						reservation.timeStart = reservation.timeStart.toISOString();
						reservation.timeEnd = reservation.timeEnd.toISOString();
					}

					navigation.navigate('EditAppointment', {
						data: {...reservation}
					});
				}}
			>
				{reservation.timeStart instanceof Date &&
					<Text style={{
						fontSize: 18,
						fontWeight: "bold"
					}}>{String(reservation.timeStart.getHours()).padStart(2, "0") + ":" + String(reservation.timeStart.getMinutes()).padStart(2, "0")}</Text>
				}
				<Text style={{fontSize}}>{reservation.clientName}</Text>
				<Text style={{fontSize}}>{reservation.serviceName}</Text>
			</TouchableOpacity>
		);
	};

	const renderEmptyData = () => {
		return <Text style={{fontSize: 16, textAlign: "center", padding: 15}}>Nada aqui</Text>
	}

	return (
		<Agenda
			refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh}/>}
			items={convertAppointmentsToAgendaItems(appointments)}
			showOnlySelectedDayItems={true}
			renderEmptyData={renderEmptyData}
			renderItem={renderItem}
			reservationsKeyExtractor={reservationsKeyExtractor}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},

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
