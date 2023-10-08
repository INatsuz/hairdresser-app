import {useEffect, useState} from "react";
import {getWithAuth} from "../utils/requester.ts";
import Service from "../types/Service.ts";
import {logout} from "../redux/sessionSlice.ts";
import {useDispatch} from "react-redux";

export default function useServices() {

	const [services, setServices] = useState<Service[]>([]);
	const dispatch = useDispatch();

	useEffect(() => {
		getWithAuth("/api/getServices").then(res => {
			setServices(res.data);
		}).catch(() => {
			dispatch(logout());
		});
	}, []);

	return [services, setServices] as const;
}