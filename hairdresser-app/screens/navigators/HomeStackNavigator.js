import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Home from "../Home";
import Edit from "../Edit";
import Add from "../Add";

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
				name={"Edit"}
				component={Edit}
				options={{title: 'Edit Appointment', headerShown: true}}
			/>
			<Stack.Screen
				name={"Add"}
				component={Add}
				options={{title: 'Add Appointment', headerShown: true}}
			/>
		</Stack.Navigator>
	)
};