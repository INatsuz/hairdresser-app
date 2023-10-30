import {useEffect, useState} from "react";
import {getWithAuth} from "../utils/Requester";

export default function useUsers() {

	const [users, setUsers] = useState([]);

	useEffect(() => {
		getWithAuth("api/getUsers").then(res => {
			setUsers(res.data);
		}).catch(() => {
			console.log("Error fetching users");
		});
	}, []);

	return [users, setUsers];
}