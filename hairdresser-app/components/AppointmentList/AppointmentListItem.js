import {Platform, StatusBar, StyleSheet, Text, View} from "react-native";
import {TouchableOpacity, TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {memo, useState} from 'react';
import Ionicons from "@expo/vector-icons/Ionicons";
import Tooltip from "react-native-walkthrough-tooltip";

function AppointmentListItem(props) {
	const [isTooltipVisible, setIsTooltipVisible] = useState(false);

	let datetime = new Date(props.data.timeStart);
	const timeString = String(datetime.getHours()).padStart(2, "0") + ":" + String(datetime.getMinutes()).padStart(2, "0");

	let variableStyles = StyleSheet.create({
		statusBorderColor: {
			borderRightColor: "red"
		}
	});

	return (
		<TouchableOpacity onPress={() => props.onItemPress(props.data)}>
			<View style={[styles.listItemContainer, variableStyles.statusBorderColor]}>
				{
					props.data.assignedUser &&
					<View style={styles.driverIconPosition}>
						<TouchableWithoutFeedback onPress={() => setIsTooltipVisible(true)}>
							<View style={styles.driverIconContainer}>
								<Tooltip
									isVisible={isTooltipVisible}
									content={
										<Text>{props.data.assignedUserName}</Text>
									}
									placement="top"
									onClose={() => setIsTooltipVisible(false)}
									disableShadow={true}
									displayInsets={{top: 24, bottom: 24, left: 24, right: 10}}
									topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
								>
									<Ionicons name={"person"} size={16} color={props.data.color}/>
								</Tooltip>
							</View>
						</TouchableWithoutFeedback>
					</View>
				}
				<View style={styles.fieldSection}>
					<View>
						<Text style={[styles.textStyle, styles.time]}>{timeString}</Text>
					</View>
					<View style={styles.clientServiceSection}>
						<View style={styles.clientField}>
							<Text style={styles.textStyle} numberOfLines={1}>{props.data.clientName}</Text>
						</View>
						<View style={styles.serviceField}>
							<Text style={styles.textStyle} numberOfLines={1}>{props.data.serviceName}</Text>
						</View>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	listItemContainer: {
		position: "relative",
		overflow: "hidden",
		display: "flex",
		flexDirection: "row",
		borderRadius: 10,
		borderWidth: 1,
		borderRightWidth: 4,
		borderTopColor: "black",
		borderLeftColor: "black",
		borderBottomColor: "black",
		marginVertical: 2,
		marginHorizontal: 10,
		paddingVertical: 10,
		paddingHorizontal: 10,
		backgroundColor: "white"
	},

	fieldSection: {
		flexGrow: 1,
		display: "flex",
		flexDirection: "row",
	},

	clientServiceSection: {
		flexGrow: 1,
		flexDirection: "row",
		marginRight: 25,
		marginLeft: 10,
		justifyContent: "space-between"
	},

	clientField: {
		flex: 6.5
	},

	serviceField: {
		paddingLeft: 10,
		flex: 3.5
	},

	textStyle: {
		color: "black",
		fontSize: 15
	},

	time: {
		fontWeight: "bold"
	},

	driverIconPosition: {
		position: "absolute",
		top: 0,
		right: 0,
		zIndex: 1
	},

	driverIconContainer: {
		padding: 10
	}
});

export default memo(AppointmentListItem)
