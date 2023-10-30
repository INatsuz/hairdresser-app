import {useEffect, useState} from "react";
import {getWithAuth} from "../utils/Requester";

export default function useAppointments() {

	const [appointments, setAppointments] = useState([]);

	useEffect(() => {
		getWithAuth("api/getAppointments").then(res => {
			res.data.forEach(ap => {
				ap.timeStart = new Date(ap.timeStart);
				ap.timeEnd = new Date(ap.timeEnd);
			})

			setAppointments(res.data);
		}).catch(() => {
			console.log("Error fetching appointments");
		});
	}, []);

	return [appointments, setAppointments];
}