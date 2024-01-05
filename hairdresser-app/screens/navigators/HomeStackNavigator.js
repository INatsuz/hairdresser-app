import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Home from "../Home";
import EditAppointment from "../EditAppointment";
import AddAppointment from "../AddAppointment";
import AddClient from "../AddClient";

export default function HomeStackNavigator() {
	const Stack = createNativeStackNavigator();

	return(
		<Stack.Navigator>
			<Stack.Screen
				name={"Home"}
				component={Home}
				options={{title: 'Home', headerShown: false}}
			/>
			<Stack.Screen
				name={"AddAppointment"}
				component={AddAppointment}
				options={{title: 'Nova Marcação', headerShown: true}}
			/>
			<Stack.Screen
				name={"EditAppointment"}
				component={EditAppointment}
				options={{title: 'Editar Marcação', headerShown: true}}
			/>
			<Stack.Screen
				name={"AddClient"}
				component={AddClient}
				options={{title: 'Novo Cliente', headerShown: true}}
			/>
		</Stack.Navigator>
	)
};
