import {View, Text, StyleSheet, Alert} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
import {deleteTokens} from "../../utils/TokenManager";

export default function UserSection(props) {
	const username = useSelector(state => state.session.user.name);
	const dispatch = useDispatch();

	const confirmLogoutDialog = () => {
		Alert.alert(
			"Confirm",
			"Are you sure you want to log out?",
			[
				{
					text: "Yes",
					onPress: async () => {
						props.onLogoutPress();
					}
				},
				{
					text: "Cancel",
					style: "cancel"
				}
			]
		);
	}

	return (
		<View style={[styles.area]}>
			<Text style={styles.nameText}>Hairdresser: {username}</Text>
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