import {useEffect, useState} from "react";
import {getWithAuth} from "../utils/Requester";

export default function useClients() {

	const [clients, setClients] = useState([]);

	useEffect(() => {
		getWithAuth("api/getClients").then(res => {
			res.data.forEach(client => {
				if (client.birthday) {
					client.birthday = new Date(client.birthday);
				}
			});

			setClients(res.data);
		}).catch(() => {
			console.log("Error fetching clients");
		});
	}, []);

	return [clients, setClients];
}