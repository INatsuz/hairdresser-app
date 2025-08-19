import {useEffect, useState} from "react";
import {getWithAuth} from "../utils/Requester";
import {useCalendars} from "expo-localization";

export default function useMarkedDates(shouldFetch = false) {
	const calendars = useCalendars();
	const [markedDates, setMarkedDates] = useState([])

	useEffect(() => {
		if (!shouldFetch) return;

		fetchMarkedDates();
	}, []);

	function fetchMarkedDates() {
		return getWithAuth(`api/getMarkedDates?timezone=${calendars[0].timeZone}`).then(res => {
			setMarkedDates(res.data);
			return res;
		}).catch(() => {
			console.log("Error fetching appointments");
		});
	}

	return [markedDates, setMarkedDates, fetchMarkedDates];
}
