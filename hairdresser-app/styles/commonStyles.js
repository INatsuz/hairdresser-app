import {NativeModules, Platform, StyleSheet} from "react-native";

const {StatusBarManager} = NativeModules;
const statusBarHeight = Platform.OS === "ios" ? 20 : StatusBarManager.HEIGHT;

const styles = StyleSheet.create({
	topPaddingContainer: {
		paddingTop: statusBarHeight
	},

	input: {
		fontSize: 16,
		borderStyle: "solid",
		borderWidth: 2,
		borderColor: "gray",
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderRadius: 5,
		marginBottom: 10
	}
});

export default styles;