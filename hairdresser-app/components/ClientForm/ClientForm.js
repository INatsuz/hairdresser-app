import {useState} from "react";
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

export default function ClientForm({data, onSubmit, onDelete}) {
	console.log(data)

	const [name, setName] = useState(data ? data.name : "");
	const [phone, setPhone] = useState(data ? data.phone : "");
	const [email, setEmail] = useState(data ? data.email : "");
	const [birthday, setBirthday] = useState(data ? new Date(data.birthday) : new Date());
	const [nif, setNif] = useState(data ? data.nif : "");
	const [address, setAddress] = useState(data ? data.address : "");
	const [observations, setObservations] = useState(data ? data.observations : "");

	const [pickingDate, setPickingDate] = useState(false);

	let birthdayString = String(birthday.getDate()).padStart(2, "0") + "/" + String(birthday.getMonth() + 1).padStart(2, "0") + "/" + birthday.getFullYear();

	function onBirthdayPress() {
		setPickingDate(true);
	}

	function onSubmitPress() {
		const client = {
			ID: data ? data.ID : null,
			name: name,
			phone: phone,
			email: email,
			birthday: birthday,
			nif: nif,
			address: address,
			observations: observations,
		}

		onSubmit(client);
	}

	function onDeletePress() {
		Alert.alert(
			"Confirmar",
			"Tem a certeza que quer eliminar este cliente?",
			[
				{
					text: "Sim",
					onPress: () => {
						onDelete(data.ID);
					}
				}, {
				text: "Cancelar",
				style: "cancel"
			}
			]
		);
	}

	return (
		<KeyboardAvoidingView style={commonStyles.formContainer} behavior={Platform.OS === 'ios' ? 'padding' : ''} keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} >
			{pickingDate && Platform.OS === "android" &&
				<DateTimePicker value={birthday} mode="date" onChange={(event, date) => {
					setBirthday(date);
					setPickingDate(false);
				}}/>
			}
			<ScrollView style={commonStyles.flex1Container}>
				<Text style={commonStyles.labelTextStyle}>Nome:</Text>
				<TextInput value={name} placeholder={"Nome"} keyboardType={"default"} numberOfLines={1} onChangeText={v => setName(v)} style={[commonStyles.input, {marginBottom: 5}]}/>

				<Text style={commonStyles.labelTextStyle}>Telemóvel:</Text>
				<TextInput value={phone} placeholder={"Telemóvel"} keyboardType={"phone-pad"} numberOfLines={1} onChangeText={v => setPhone(v)} style={[commonStyles.input, {marginBottom: 5}]}/>

				<Text style={commonStyles.labelTextStyle}>Email:</Text>
				<TextInput value={email} placeholder={"Email"} keyboardType={"email-address"} autoCapitalize={"none"} numberOfLines={1} onChangeText={v => setEmail(v)} style={[commonStyles.input, {marginBottom: 5}]}/>

				{
					Platform.OS === "ios" ?
						<View style={[commonStyles.iosTimeSection, {marginBottom: 5}]}>
							<View>
								<Text style={commonStyles.labelTextStyle}>Data de Nascimento: </Text>
							</View>

							<DateTimePicker value={birthday} mode="date" preferredDatePickerStyle={"compact"} onChange={(event, date) => {
								setBirthday(date);
							}}/>
						</View>
						:
						<>
							<Text style={commonStyles.labelTextStyle}>Data de Nascimento: </Text>
							<Pressable onPress={onBirthdayPress}>
								<TextInput pointerEvents={"none"} editable={false} value={birthdayString} style={commonStyles.input}/>
							</Pressable>
						</>
				}

				<Text style={commonStyles.labelTextStyle}>NIF:</Text>
				<TextInput value={nif} placeholder={"NIF"} keyboardType={"default"} numberOfLines={1} onChangeText={v => setNif(v)} style={[commonStyles.input, {marginBottom: 5}]}/>

				<Text style={commonStyles.labelTextStyle}>Morada:</Text>
				<TextInput value={address} placeholder={"Morada"} keyboardType={"default"} numberOfLines={1} onChangeText={v => setAddress(v)} style={[commonStyles.input, {marginBottom: 5}]}/>

				<Text style={commonStyles.labelTextStyle}>Observações: </Text>
				<TextInput placeholder={"Observações"} defaultValue={observations} placeholderTextColor="#A3A9AA" multiline numberOfLines={2} textAlignVertical={"top"} value={observations} style={[commonStyles.input, styles.observations]} onChangeText={(value) => setObservations(value)}/>

				<View>
					<Button title={data ? "Guardar" : "Criar"} onPress={onSubmitPress}/>
				</View>
				<View style={styles.deleteButton}>
					{
						data &&
						<Button title={"Eliminar"} color={"red"} onPress={onDeletePress}/>
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
