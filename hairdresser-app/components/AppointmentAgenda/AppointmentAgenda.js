import {Agenda, CalendarProvider} from "react-native-calendars";
import useAppointments from "../../hooks/useAppointments";
import {ActivityIndicator, RefreshControl, Text} from "react-native";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import useMarkedDates from "../../hooks/useMarkedDates";
import {AppointmentAgendaItem} from "./AppointmentAgendaItem";
import {formatDateString} from "../../utils/DateUtils";

export default function AppointmentAgenda() {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [appointments, setAppointments, fetchAppointments] = useAppointments(false);
	const [markedDates, setMarkedDates, fetchMarkedDates] = useMarkedDates();

	const [isRefreshing, setIsRefreshing] = useState(false);

	const navigation = useNavigation();

	useEffect(() => {
		return navigation.addListener('focus', () => {
			setIsRefreshing(true);
			fetchMarkedDates();
			fetchAppointments(currentDate).finally(() => setIsRefreshing((prev) => false));
		});
	}, [navigation]);

	const formattedMarkedDates = useMemo(() => {
		const markedDatesObject = {};
		markedDates.forEach(markedDate => {
			const date = new Date(markedDate.convertedTime);
			markedDatesObject[`${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`] = {marked: true};
		});

		return markedDatesObject;
	}, [markedDates]);

	const formattedAgendaItems = useMemo(() => {
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

		setIsRefreshing(false);
		return agendaItems;
	}, [appointments]);

	const renderItem = useCallback((reservation, isFirst) => {
		return <AppointmentAgendaItem reservation={reservation} isFirst={isFirst}/>
	}, []);

	const renderEmptyData = useCallback(() => {
		if (isRefreshing) return <ActivityIndicator size="large" style={{marginTop: 20}}/>

		return <Text style={{fontSize: 16, textAlign: "center", padding: 15}}>Nada aqui</Text>
	}, [isRefreshing]);

	function handleRefresh() {
		setIsRefreshing(true);
		fetchAppointments(currentDate)
	}

	function reservationsKeyExtractor(dayAgenda, index) {
		return `${dayAgenda.reservation.ID} + ${dayAgenda.reservation.timeStart}`;
	}

	function onDayPress({dateString}) {
		const date = new Date(dateString);
		setCurrentDate(date);
		setIsRefreshing(true);
		fetchAppointments(date)
	}

	return (
		<Agenda
			refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh}/>}
			items={formattedAgendaItems}
			markedDates={formattedMarkedDates}
			showOnlySelectedDayItems={true}
			renderEmptyData={renderEmptyData}
			renderItem={renderItem}
			onDayPress={onDayPress}
			reservationsKeyExtractor={reservationsKeyExtractor}
		/>
	);
};
