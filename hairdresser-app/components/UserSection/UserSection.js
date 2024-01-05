import {Alert, StyleSheet, Text, View} from "react-native";
import {useSelector} from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function UserSection(props) {
	const username = useSelector(state => state.session.user.name);

	const confirmLogoutDialog = () => {
		Alert.alert(
			"Confirmar",
			"Tem a certeza que quer fazer logout?",
			[
				{
					text: "Sim",
					onPress: async () => {
						props.onLogoutPress();
					}
				},
				{
					text: "Cancelar",
					style: "cancel"
				}
			]
		);
	}

	return (
		<View style={[styles.area]}>
			<Text style={styles.nameText}>Utilizador: {username}</Text>
			<Ionicons name="log-out" size={22} color={styles.nameText.color} onPress={confirmLogoutDialog}/>
		</View>
	);
};

const styles = StyleSheet.create({
	area: {
		padding: 5,
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: "black",
		display: "flex",
		flexDirection: "row",
	},

	nameText: {
		color: "black",
		fontSize: 18,
		flex: 1
	}
});
