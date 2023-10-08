import {useEffect, useState} from "react";
import {getWithAuth} from "../utils/requester.ts";
import User from "../types/User.ts";
import {logout} from "../redux/sessionSlice.ts";
import {useDispatch} from "react-redux";

export default function useUsers() {

	const [users, setUsers] = useState<User[]>([]);
	const dispatch = useDispatch();

	useEffect(() => {
		getWithAuth("/api/getUsers").then(res => {
			setUsers(res.data);
		}).catch(() => {
			dispatch(logout());
		});
	}, []);

	return [users, setUsers] as const;
}