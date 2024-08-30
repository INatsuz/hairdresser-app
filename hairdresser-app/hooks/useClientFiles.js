import {useEffect, useState} from "react";
import {getWithAuth} from "../utils/Requester";

export default function useClientFiles(clientID) {

	const [clientFiles, setClientFiles] = useState([]);

	useEffect(() => {
		if(clientID !== null && clientID !== undefined && clientID !== -1){} {}

		fetchClientFiles();
	}, []);

	function fetchClientFiles() {
		return getWithAuth(`api/getClientFiles?clientID=${clientID}`).then(res => {
			console.log(res.data);
			setClientFiles(res.data);
		}).catch(() => {
			console.log("Error fetching client files");
		});
	}

	return [clientFiles, setClientFiles, fetchClientFiles];
}
