import {deleteWithAuth, putWithAuth} from "../utils/Requester";
import ClientForm from "../components/ClientForm/ClientForm";

export default function EditClient({route, navigation}) {

	function onSave(client) {
		putWithAuth("api/editClient", {
			ID: client.ID,
			name: client.name,
			phone: client.phone,
			email: client.email,
			birthday: `${client.birthday.getFullYear()}-${client.birthday.getMonth() + 1}-${client.birthday.getDate()}`,
			nif: client.nif,
			address: client.address,
			observations: client.observations
		}).then(() => {
			navigation.navigate("Clients");
		});
	}

	function onDelete(id) {
		deleteWithAuth(`api/deleteClient/${id}`).then(() => {
			navigation.navigate("Home");
		}).catch(err => {
			console.log(err);
		});
	}

	return (
		<ClientForm data={route.params.data} onSubmit={onSave} onDelete={onDelete}/>
	);
};
