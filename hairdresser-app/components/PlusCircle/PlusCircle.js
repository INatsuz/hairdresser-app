import {StyleSheet, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useNavigation} from "@react-navigation/native";
import {Menu, MenuOption, MenuOptions, MenuTrigger} from "react-native-popup-menu";

export default function PlusCircle() {
	const navigation = useNavigation();

	return (
		<Menu>
			<MenuTrigger>
				<View style={styles.plusContainer}>
					<Ionicons name="add" size={22} color={"#000"}/>
				</View>
			</MenuTrigger>
			<MenuOptions>
				<MenuOption customStyles={{optionText: styles.menuOption}} onSelect={() => navigation.navigate("AddAppointment")} text="Marcação"/>
				<MenuOption customStyles={{optionText: styles.menuOption}} onSelect={() => navigation.navigate("AddClient")} text="Cliente"/>
			</MenuOptions>
		</Menu>
	);
};

const styles = StyleSheet.create({
	plusContainer: {
		height: 50,
		width: 50,
		justifyContent: "center",
		alignItems: "center",
		borderStyle: "solid",
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 25,
		zIndex: 10
	},

	menuOption: {
		fontSize: 20
	}
});
