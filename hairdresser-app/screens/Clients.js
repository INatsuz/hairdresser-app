import {SafeAreaView, StyleSheet, View} from "react-native";
import commonStyles from "../styles/commonStyles";
import PlusCircle from "../components/PlusCircle/PlusCircle";
import useClients from "../hooks/useClients";
import ClientList from "../components/ClientList/ClientList";

export default function Clients({navigation}) {

	const [clients, , fetchClients] = useClients();

	function navigateToEdit(data) {
		data.birthday = data.birthday.toISOString();
		navigation.navigate('EditClient', {data: data});
	}

	return (
		<SafeAreaView style={[styles.container, commonStyles.relativeContainer, commonStyles.flex1Container]}>
			<ClientList clients={clients} fetchClients={fetchClients} onItemPress={navigateToEdit}/>
			<View style={styles.plusContainer}>
				<PlusCircle/>
			</View>
		</SafeAreaView>
	)
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white"
	},

	plusContainer: {
		position: "absolute",
		bottom: 10,
		right: 10
	}
});
