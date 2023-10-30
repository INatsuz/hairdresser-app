import {TouchableOpacity, StyleSheet} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useNavigation} from "@react-navigation/native";

export default function PlusCircle() {
	const navigation = useNavigation();

	return (
		<TouchableOpacity style={styles.plusContainer} onPress={() => navigation.navigate("Add")}>
			<Ionicons name="add" size={22} color={"#000"}/>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	plusContainer: {
		position: "absolute",
		bottom: 10,
		right: 10,
		height: 50,
		width: 50,
		justifyContent: "center",
		alignItems: "center",
		borderStyle: "solid",
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 25,
		zIndex: 10
	}
});