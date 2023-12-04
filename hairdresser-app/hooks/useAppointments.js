import {useEffect, useState} from "react";
import {getWithAuth} from "../utils/Requester";

export default function useAppointments(daily = false) {

	const [appointments, setAppointments] = useState([]);

	useEffect(() => {
		fetchAppointments();
	}, []);

	function fetchAppointments() {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		const dateFilter = `?startDate=${today.toISOString()}&endDate=${tomorrow.toISOString()}`;

		return getWithAuth(`api/getAppointments${daily ? dateFilter : ""}`).then(res => {
			res.data.forEach(ap => {
				ap.timeStart = new Date(ap.timeStart);
				ap.timeEnd = new Date(ap.timeEnd);
			})

			setAppointments(res.data);
			return res;
		}).catch(() => {
			console.log("Error fetching appointments");
		});
	}

	return [appointments, setAppointments, fetchAppointments];
}
