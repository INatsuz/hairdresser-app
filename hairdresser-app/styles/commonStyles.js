import {NativeModules, Platform, StyleSheet} from "react-native";

const {StatusBarManager} = NativeModules;
const statusBarHeight = Platform.OS === "ios" ? 20 : StatusBarManager.HEIGHT;

const styles = StyleSheet.create({
	topPaddingContainer: {
		paddingTop: statusBarHeight
	},

	relativeContainer: {
		position: "relative",
	},

	flex1Container: {
		flex: 1
	},

	formContainer: {
		backgroundColor: "white",
		flex: 1,
		padding: 10,
	},

	input: {
		fontSize: 16,
		color: "black",
		borderStyle: "solid",
		borderWidth: 2,
		borderColor: "gray",
		borderRadius: 5,
		paddingVertical: 5,
		paddingHorizontal: 10,
		marginBottom: 10
	},

	searchDropdownStyle: {
		width: "100%",
		backgroundColor: "white",
		borderWidth: 2,
		borderColor: "gray",
		borderRadius: 5,
		height: 45,
		marginBottom: 10,
	},

	searchDropdownTextStyle: {
		fontSize: 16,
		textAlign: "left",
		marginLeft: 0,
	},

	labelTextStyle: {
		fontSize: 18,
	},

	iosTimeSection: {
		marginBottom: 15,
		display: "flex",
		flexDirection: "row",
		alignItems: "center"
	},
});

export default styles;