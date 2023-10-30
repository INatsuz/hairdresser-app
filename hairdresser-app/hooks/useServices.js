import {useEffect, useState} from "react";
import {getWithAuth} from "../utils/Requester";

export default function useServices() {

	const [services, setServices] = useState([]);

	useEffect(() => {
		getWithAuth("api/getServices").then(res => {
			setServices(res.data);
		}).catch(() => {
			console.log("Error fetching services");
		});
	}, []);

	return [services, setServices];
}