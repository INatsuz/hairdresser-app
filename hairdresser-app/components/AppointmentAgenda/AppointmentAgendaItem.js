import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {memo} from "react";
import {useNavigation} from "@react-navigation/native";

export const AppointmentAgendaItem = memo(function AppointmentAgendaItem ({reservation, isFirst}) {
	const fontSize = 16;
	const navigation = useNavigation();

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
}, (prevProps, nextProps) => {
	return prevProps.reservation === nextProps.reservation;
});

const styles = StyleSheet.create({
	item: {
		backgroundColor: 'white',
		flex: 1,
		borderRadius: 5,
		padding: 10,
		marginRight: 10,
		marginTop: 17
	}
});
