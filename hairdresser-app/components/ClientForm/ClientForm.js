import {useEffect, useRef, useState} from "react";
import {
	Alert,
	Button, FlatList,
	KeyboardAvoidingView, Linking,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput, TouchableHighlight,
	View
} from "react-native";
import commonStyles from "../../styles/commonStyles";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import {deleteWithAuth, getWithAuth, IP, postWithAuthMultipart, putWithAuth} from "../../utils/Requester";
import * as ImagePicker from 'expo-image-picker';
import {useActionSheet} from "@expo/react-native-action-sheet";
import Dialog from "react-native-dialog";
import useClientFiles from "../../hooks/useClientFiles";

export default function ClientForm({data, onSubmit, onDelete}) {
	const [name, setName] = useState(data ? data.name : "");
	const [phone, setPhone] = useState(data ? data.phone : "");
	const [email, setEmail] = useState(data ? data.email : "");
	const [birthday, setBirthday] = useState(data ? new Date(data.birthday) : new Date());
	const [nif, setNif] = useState(data ? data.nif : "");
	const [address, setAddress] = useState(data ? data.address : "");
	const [observations, setObservations] = useState(data ? data.observations : "");
	const [files, setFiles, fetchFiles] = useClientFiles(data.ID);

	const [isFilenameDialogVisible, setIsFilenameDialogVisible] = useState(false);
	const [isFilenameChangeDialogVisible, setIsFilenameChangeDialogVisible] = useState(false);
	const [filenameInputText, setFilenameInputText] = useState("");
	const fileBeingRenamed = useRef(null);
	const selectedFileRes = useRef(null);

	const [pickingDate, setPickingDate] = useState(false);

	const {showActionSheetWithOptions} = useActionSheet();

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

	async function onChooseFilePress() {
		const options = ["Escolher PDF", "Escolher Foto", "Tirar foto", "Cancelar"];
		const cancelButtonIndex = 3;

		showActionSheetWithOptions({options, cancelButtonIndex}, async (selectedIndex) => {
			switch (selectedIndex) {
				case 0:
					DocumentPicker.getDocumentAsync({type: "application/pdf"}).then(docRes => {
						if (!docRes.canceled) {
							selectedFileRes.current = docRes;
							setIsFilenameDialogVisible(true);
						}
						selectedFileRes.current = docRes;
					});

					break;
				case 1:
					const imageResult = await ImagePicker.launchImageLibraryAsync();

					if (!imageResult.canceled) {
						selectedFileRes.current = imageResult;
						setIsFilenameDialogVisible(true);
					}

					break;
				case 2:
					let cameraPermissions = await ImagePicker.getCameraPermissionsAsync();
					if (!cameraPermissions.granted) {
						if (cameraPermissions.canAskAgain) {
							cameraPermissions = await ImagePicker.requestCameraPermissionsAsync();
						}
					}
					if (cameraPermissions.granted) {
						const imageResult = await ImagePicker.launchCameraAsync();

						if (!imageResult.canceled) {
							selectedFileRes.current = imageResult;
							setIsFilenameDialogVisible(true);
						}
					}

					break;
				case cancelButtonIndex:
					break;
			}
		});
	}

	async function onFileLongPress(fileID) {
		const options = ["Eliminar", "Mudar nome", "Cancelar"];
		const cancelButtonIndex = 2;

		showActionSheetWithOptions({options, cancelButtonIndex}, async (selectedIndex) => {
			switch (selectedIndex) {
				case 0:
					deleteWithAuth(`api/deleteClientFile?ID=${fileID}`).then(r => {
						console.log("File deleted");
					}).then(res => {
						fetchFiles();
					});

					break;
				case 1:
					fileBeingRenamed.current = fileID;
					setIsFilenameChangeDialogVisible(true);

					break;
				case cancelButtonIndex:
					break;
			}
		});
	}

	function onFilenameConfirm() {
		setIsFilenameDialogVisible(false);
		sendFile(selectedFileRes.current, filenameInputText);
		setFilenameInputText("");
	}

	function onFilenameChangeConfirm() {
		setIsFilenameChangeDialogVisible(false);
		sendFilenameChange(filenameInputText);
		setFilenameInputText("");
	}

	function onFileLinkPress(fileID, filepath) {
		const folderPath = filepath.slice(0, filepath.lastIndexOf("/") + 1);
		const filename = filepath.slice(filepath.lastIndexOf("/") + 1);

		getWithAuth(`users/getResourceToken?ID=${fileID}`).then(res => {
			const token = res.data.resourceToken;
			console.log(token);
			Linking.openURL(`https://${IP}/${folderPath}${encodeURIComponent(filename)}?t=${token}`);
		});
	}

	function sendFile(fileResult, filename = null) {
		if (fileResult.canceled === false) {
			let formData = new FormData();

			let file = {
				uri: fileResult.assets[0].uri,
				type: fileResult.assets[0].mimeType,
				name: filename + fileResult.assets[0].uri.slice(fileResult.assets[0].uri.lastIndexOf('.')) ?? fileResult.assets[0].name ?? fileResult.assets[0].fileName,
			};

			formData.append("clientId", data.ID);
			formData.append("file", file);

			postWithAuthMultipart("api/saveClientFile", formData, {headers: {"Content-Type": "multipart/form-data"}}).then(r => {
				fetchFiles();
			}).catch(err => {
				console.log(err);
			});
		}
	}

	function sendFilenameChange(newFilename) {
		const data = {
			ID: fileBeingRenamed.current,
			newFilename
		};

		putWithAuth(`api/renameClientFile`, data).then(r => {
			fetchFiles();
		}).catch(err => {
			console.log(err);
		});
	}

	return (
		<KeyboardAvoidingView style={commonStyles.formContainer} behavior={Platform.OS === 'ios' ? 'padding' : ''} keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
			{pickingDate && Platform.OS === "android" &&
				<DateTimePicker value={birthday} mode="date" onChange={(event, date) => {
					setBirthday(date);
					setPickingDate(false);
				}}/>
			}

			<Dialog.Container visible={isFilenameDialogVisible}>
				<Dialog.Title>Nome do ficheiro</Dialog.Title>
				<Dialog.Description>
					Insere um nome para o ficheiro
				</Dialog.Description>
				<Dialog.Input onChangeText={v => setFilenameInputText(v)}/>
				<Dialog.Button label="Guardar" onPress={onFilenameConfirm}/>
				<Dialog.Button label="Cancelar" onPress={() => setIsFilenameDialogVisible(false)}/>
			</Dialog.Container>

			<Dialog.Container visible={isFilenameChangeDialogVisible}>
				<Dialog.Title>Nome do ficheiro</Dialog.Title>
				<Dialog.Description>
					Insere um nome para o ficheiro
				</Dialog.Description>
				<Dialog.Input onChangeText={v => setFilenameInputText(v)}/>
				<Dialog.Button label="Guardar" onPress={onFilenameChangeConfirm}/>
				<Dialog.Button label="Cancelar" onPress={() => setIsFilenameChangeDialogVisible(false)}/>
			</Dialog.Container>

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

				{
					data &&
					<View>
						<Text style={commonStyles.labelTextStyle}>Ficheiros: </Text>
						{files.map((file, index) =>
							<TouchableHighlight key={file.ID} style={styles.fileItemRadius} underlayColor={"lightgray"} onPress={() => onFileLinkPress(file.ID, file.file)} onLongPress={() => onFileLongPress(file.ID)}>
								<Text style={index !== files.length - 1 ? [styles.fileItem, styles.fileItemSeparator] : [styles.fileItem]}>
									{file.file.slice(file.file.lastIndexOf("/") + 1)}
								</Text>
							</TouchableHighlight>
						)}
					</View>
				}

				{
					data &&
					<View style={styles.chooseFileButton}>
						<Button title={"Escolher ficheiro"} onPress={onChooseFilePress}/>
					</View>
				}

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
	);
};

const styles = StyleSheet.create({
	chooseFileButton: {
		marginBottom: 10
	},

	deleteButton: {
		marginTop: 10
	},

	observations: {
		minHeight: 50
	},

	fileItemRadius: {
		borderRadius: 5,
	},

	fileItem: {
		padding: 5,
	},

	fileItemSeparator: {
		borderColor: "gray",
		borderBottomWidth: 1,
	}
});
