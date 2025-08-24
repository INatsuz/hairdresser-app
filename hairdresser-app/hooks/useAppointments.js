import {useEffect, useState} from "react";
import {getWithAuth} from "../utils/Requester";

export default function useAppointments(shouldFetch = false) {

	const [appointments, setAppointments] = useState([]);

	useEffect(() => {
		if (!shouldFetch) return;

		fetchAppointments(new Date());
	}, []);

	function fetchAppointments(day = undefined) {
		console.log(day);
		let dateFilter = "";

		if (day) {
			const startDate = new Date(day);
			startDate.setHours(0, 0, 0, 0);
			const endDate = new Date(startDate);
			endDate.setDate(endDate.getDate() + 1);

			dateFilter = `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
		}

		return getWithAuth(`api/getAppointments${day ? dateFilter : ""}`).then(res => {
			res.data.forEach(ap => {
				ap.timeStart = new Date(ap.timeStart);
				ap.timeEnd = new Date(ap.timeEnd);
			})

			setAppointments(res.data);
			return res;
		}).catch(() => {
			setAppointments([]);
			console.log("Error fetching appointments");
		});
	}

	return [appointments, setAppointments, fetchAppointments];
}
