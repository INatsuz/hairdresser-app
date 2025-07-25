import useServices from "../../hooks/useServices";
import useClients from "../../hooks/useClients";
import useUsers from "../../hooks/useUsers";
import {useEffect, useState} from "react";
import {
	Alert,
	Button,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View
} from "react-native";
import commonStyles from "../../styles/commonStyles";
import DateTimePicker from "@react-native-community/datetimepicker";
import SelectDropdown from "react-native-select-dropdown";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function AppointmentForm({data, onSubmit, onDelete}) {
	const [services] = useServices();
	const [clients] = useClients();
	const [users] = useUsers();

	const [service, setService] = useState(data ? data.serviceID : null);
	const [client, setClient] = useState(data ? data.clientID : null);
	const [timeStart, setTimeStart] = useState(data ? new Date(data.timeStart) : new Date());
	const [timeEnd, setTimeEnd] = useState(data ? new Date(data.timeEnd) : new Date());
	const [price, setPrice] = useState(data ? (data.price / 100).toFixed(2) : "");
	const [assignedUser, setAssignedUser] = useState(data ? data.assignedUser : null);
	const [observations, setObservations] = useState(data ? data.observations : "");

	const [pickingStartDate, setPickingStartDate] = useState(false);
	const [pickingStartTime, setPickingStartTime] = useState(false);

	const [pickingEndDate, setPickingEndDate] = useState(false);
	const [pickingEndTime, setPickingEndTime] = useState(false);

	let timeStartString = String(timeStart.getDate()).padStart(2, "0") + "/" + String(timeStart.getMonth() + 1).padStart(2, "0") + "/" + timeStart.getFullYear() + " " + String(timeStart.getHours()).padStart(2, "0") + ":" + String(timeStart.getMinutes()).padStart(2, "0");
	let timeEndString = String(timeEnd.getDate()).padStart(2, "0") + "/" + String(timeEnd.getMonth() + 1).padStart(2, "0") + "/" + timeEnd.getFullYear() + " " + String(timeEnd.getHours()).padStart(2, "0") + ":" + String(timeEnd.getMinutes()).padStart(2, "0");

	useEffect(() => {
		const serviceObj = services.find(s => s.ID === service);

		if (serviceObj) {
			const timeEnd = new Date(timeStart);
			timeEnd.setMinutes(timeEnd.getMinutes() + serviceObj.estimatedTime);
			setTimeEnd(timeEnd);
			setPrice((serviceObj.price / 100).toFixed(2));
		}
	}, [service, timeStart]);

	function onSubmitPress() {
		const appointment = {
			ID: data ? data.ID : null,
			serviceID: service,
			clientID: client,
			assignedUser,
			timeStart,
			timeEnd,
			price,
			observations
		}

		onSubmit(appointment);
	}

	function onDeletePress() {
		Alert.alert(
			"Confirm",
			"Are you sure you want delete this appointment?",
			[
				{
					text: "Yes",
					onPress: () => {
						onDelete(data.ID);
					}
				}, {
				text: "Cancel",
				style: "cancel"
			}
			]
		);
	}

	function onTimeStartPress() {
		if (Platform.OS === "android") {
			if (!pickingStartDate && !pickingStartTime) setPickingStartDate(true);
		}
	}

	function onTimeEndPress() {
		if (Platform.OS === "android") {
			if (!pickingEndDate && !pickingEndTime) setPickingEndDate(true);
		}
	}

	return (
		<KeyboardAvoidingView style={commonStyles.formContainer}>
			{pickingStartDate && Platform.OS === "android" &&
				<DateTimePicker value={timeStart} mode="date" onChange={(event, date) => {
					const newDate = timeStart;
					newDate.setFullYear(date.getFullYear());
					newDate.setMonth(date.getMonth());
					newDate.setDate(date.getDate());

					setPickingStartDate(false);
					setTimeStart(newDate);
					setPickingStartTime(true);
				}}/>
			}
			{pickingStartTime && Platform.OS === "android" &&
				<DateTimePicker value={timeStart} mode="time" onChange={(event, time) => {
					const newTime = timeStart;
					newTime.setHours(time.getHours(), time.getMinutes());

					setPickingStartTime(false);
					setTimeStart(time);
				}}/>}

			{pickingEndDate && Platform.OS === "android" &&
				<DateTimePicker value={timeEnd} mode="date" onChange={(event, date) => {
					const newDate = timeEnd;
					newDate.setFullYear(date.getFullYear());
					newDate.setMonth(date.getMonth());
					newDate.setDate(date.getDate());

					setPickingEndDate(false);
					setTimeEnd(newDate);
					setPickingEndTime(true);
				}}/>}
			{pickingEndTime && Platform.OS === "android" &&
				<DateTimePicker value={timeEnd} mode="time" onChange={(event, time) => {
					const newTime = timeEnd;
					newTime.setHours(time.getHours(), time.getMinutes());

					setPickingEndTime(false);
					setTimeEnd(time);
				}}/>}
			<ScrollView style={commonStyles.flex1Container}>
				<Text style={commonStyles.labelTextStyle}>Service:</Text>
				<SelectDropdown
					data={services.map(service => service.name)}
					defaultValue={services.find(s => s.ID === service)?.name}
					onSelect={selectedItem => {
						setService(services.find(s => s.name === selectedItem).ID);
					}}
					renderDropdownIcon={isOpened => {
						return <Ionicons name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18}/>;
					}}
					search
					buttonStyle={[commonStyles.searchDropdownStyle]}
					buttonTextStyle={commonStyles.searchDropdownTextStyle}
					statusBarTranslucent={true}
				/>

				<Text style={commonStyles.labelTextStyle}>Client:</Text>
				<SelectDropdown
					data={clients.map(client => client.name)}
					defaultValue={clients.find(c => c.ID === client)?.name}
					onSelect={selectedItem => {
						setClient(clients.find(c => c.name === selectedItem).ID);
					}}
					renderDropdownIcon={isOpened => {
						return <Ionicons name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18}/>;
					}}
					search
					buttonStyle={[commonStyles.searchDropdownStyle]}
					buttonTextStyle={commonStyles.searchDropdownTextStyle}
					statusBarTranslucent={true}
				/>

				{
					Platform.OS === "ios" ?
						<View style={commonStyles.iosTimeSection}>
							<View>
								<Text style={commonStyles.labelTextStyle}>Time Start: </Text>
							</View>

							<DateTimePicker value={timeStart} mode="datetime" preferredDatePickerStyle={"compact"} onChange={(event, datetime) => {
								setTimeStart(datetime);
							}}/>
						</View>
						:
						<>
							<Text style={commonStyles.labelTextStyle}>Time Start: </Text>
							<Pressable onPress={onTimeStartPress}>
								<TextInput pointerEvents={"none"} editable={false} value={timeStartString} style={commonStyles.input}/>
							</Pressable>
						</>
				}

				{
					Platform.OS === "ios" ?
						<View>
							<View style={[commonStyles.iosTimeSection, {marginBottom: 0}]}>
								<View>
									<Text style={commonStyles.labelTextStyle}>Time End: </Text>
								</View>

								<DateTimePicker value={timeEnd} mode="datetime" preferredDatePickerStyle={"compact"} onChange={(event, datetime) => {
									setTimeEnd(datetime);
								}}/>
							</View>
							<Text style={[commonStyles.warning, {marginBottom: 10, marginTop: 5}]}>Careful: When you change the service and/or the start time, the end time is
								automatically changed to the start time plus the estimated time of that service.</Text>
						</View>
						:
						<>
							<Text style={commonStyles.labelTextStyle}>Time End: </Text>
							<Pressable onPress={onTimeEndPress}>
								<TextInput pointerEvents={"none"} editable={false} value={timeEndString} style={[commonStyles.input, {marginBottom: 5}]}/>
							</Pressable>
							<Text style={[commonStyles.warning, {marginBottom: 10}]}>Careful: When you change the
								service and/or the start time, the end time is automatically changed to the start time
								plus the estimated time of that service.</Text>
						</>
				}

				<Text style={commonStyles.labelTextStyle}>Price:</Text>
				<TextInput value={price} placeholder={"Price (e.g. 10.00)"} keyboardType={"numeric"} numberOfLines={1} onChangeText={v => setPrice(v)} style={[commonStyles.input, {marginBottom: 5}]}/>
				<Text style={[commonStyles.warning, {marginBottom: 10}]}>Careful: When you change the service, this
					field is automatically changed to the default price of that service.</Text>

				<Text style={commonStyles.labelTextStyle}>Assigned User:</Text>
				<SelectDropdown
					data={["None", ...users.map(user => user.name)]}
					defaultValue={users.find(u => u.ID === assignedUser) ? users.find(u => u.ID === assignedUser).name : "None"}
					onSelect={selectedItem => {
						if (selectedItem === "None") {
							setAssignedUser(null);
						} else {
							setAssignedUser(users.find(u => u.name === selectedItem).ID);
						}
					}}
					renderDropdownIcon={isOpened => {
						return <Ionicons name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18}/>;
					}}
					search
					buttonStyle={[commonStyles.searchDropdownStyle]}
					buttonTextStyle={commonStyles.searchDropdownTextStyle}
					statusBarTranslucent={true}
				/>

				<Text style={commonStyles.labelTextStyle}>Observations: </Text>
				<TextInput placeholder={"Observations"} defaultValue={observations} placeholderTextColor="#A3A9AA" multiline numberOfLines={2} textAlignVertical={"top"} value={observations} style={[commonStyles.input, styles.observations]} onChangeText={(value) => setObservations(value)}/>

				<View>
					<Button title={data ? "Save" : "Add"} onPress={onSubmitPress}/>
				</View>
				<View style={styles.deleteButton}>
					{
						data &&
						<Button title={"Delete"} color={"red"} onPress={onDeletePress}/>
					}
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	)
};

const styles = StyleSheet.create({
	deleteButton: {
		marginTop: 10
	},

	observations: {
		minHeight: 50
	}
});
