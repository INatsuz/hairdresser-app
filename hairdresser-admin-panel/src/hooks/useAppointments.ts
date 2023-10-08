import {useEffect, useState} from "react";
import {getWithAuth} from "../utils/requester.ts";
import Appointment from "../types/Appointment.ts";
import {logout} from "../redux/sessionSlice.ts";
import {useDispatch} from "react-redux";

export default function useAppointments() {

	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const dispatch = useDispatch();

	useEffect(() => {
		getWithAuth("/api/getAppointments").then(res => {
			res.data.forEach((ap: Appointment) => {
				ap.timeStart = new Date(ap.timeStart);
				ap.timeEnd = new Date(ap.timeEnd);
			})

			setAppointments(res.data);
		}).catch(() => {
			dispatch(logout());
		});
	}, []);

	return [appointments, setAppointments] as const;
}