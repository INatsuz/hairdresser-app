import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Login from "../Login";
import ListAgendaTabNavigator from "./ListAgendaTabNavigator";

export default function LoginTabStackNavigator() {
	const Stack = createNativeStackNavigator();

	return(
		<Stack.Navigator>
			<Stack.Screen
				name={"Login"}
				component={Login}
				options={{title: 'Login', headerShown: false}}
			/>
			<Stack.Screen
				name={"ListAgendaTabNavigator"}
				component={ListAgendaTabNavigator}
				options={{title: 'ListAgendaTabNavigator', headerShown: false}}
			/>
		</Stack.Navigator>
	)
};