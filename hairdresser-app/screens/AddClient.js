import AppointmentForm from "../components/AppointmentForm/AppointmentForm";
import {postWithAuth} from "../utils/Requester";
import ClientForm from "../components/ClientForm/ClientForm";

export default function AddClient({route: {params}, navigation}) {

	function onSavePress(client) {
		postWithAuth("api/addClient", {
			name: client.name,
			phone: client.phone,
			email: client.email,
			birthday: `${client.birthday.getFullYear()}-${client.birthday.getMonth() + 1}-${client.birthday.getDate()}`,
			nif: client.nif,
			address: client.address,
			observations: client.observations
		}).then(() => {
			navigation.navigate("Home");
		});
	}

	return (
		<ClientForm onSubmit={onSavePress}/>
	);
};
