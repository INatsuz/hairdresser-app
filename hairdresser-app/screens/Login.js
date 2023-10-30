import {Button, KeyboardAvoidingView, NativeModules, Platform, StyleSheet, TextInput, View} from "react-native";
import commonStyles from "../styles/commonStyles";
import {useEffect, useState} from "react";
import useLogin from "../hooks/useLogin";
import {useSelector} from "react-redux";
export default function Login({route, navigation}) {

	const [checkLogin, login] = useLogin();

	const isLoggedIn = useSelector(state => state.session.loggedIn);
	console.log(isLoggedIn);

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	useEffect(() => {
		checkLogin();
	}, []);

	useEffect(() => {
		if (isLoggedIn) {
			navigation.reset({
				index: 0,
				routes: [{name: "ListAgendaTabNavigator"}]
			});
		}
	}, [isLoggedIn]);

	function handleLoginPress() {
		if (username.trim().length > 4 && password.trim().length > 6) {
			login(username, password);
		}
	}

	return (
		<KeyboardAvoidingView style={styles.kbContainer}>
			<View style={styles.container}>
				<View style={styles.formContainer}>
					<TextInput value={username} style={commonStyles.input} autoCapitalize={"none"} keyboardType={"email-address"} textContentType={"username"} caretHidden={false} placeholder="Email" placeholderTextColor="#A3A9AA" autoComplete={"email"} importantForAutofill={"yes"} onChangeText={text => setUsername(text)}/>
					<TextInput value={password} style={commonStyles.input} secureTextEntry={true} textContentType={"password"} placeholder="Password" placeholderTextColor="#A3A9AA" autoComplete={"password"} importantForAutofill={"yes"} onChangeText={text => setPassword(text)}/>
					<View style={{width: "100%"}}>
						<Button title={"Login"} onPress={handleLoginPress}/>
					</View>
				</View>
			</View>
		</KeyboardAvoidingView>
	)
};

const styles = StyleSheet.create({
	kbContainer: {
		flex: 1,
		backgroundColor: "white"
	},

	container: {
		flex: 1
	},

	formContainer: {
		display: "flex",
		justifyContent: "center",
		padding: 20,
		flex: 1
	}
});