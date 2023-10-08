import {useEffect, useState} from "react";
import {getWithAuth} from "../utils/requester.ts";
import Client from "../types/Client.ts";
import {logout} from "../redux/sessionSlice.ts";
import {useDispatch} from "react-redux";

export default function useClients() {

	const [clients, setClients] = useState<Client[]>([]);
	const dispatch = useDispatch();

	useEffect(() => {
		getWithAuth("/api/getClients").then(res => {
			setClients(res.data);
		}).catch(() => {
			dispatch(logout());
		});
	}, []);

	return [clients, setClients] as const;
}