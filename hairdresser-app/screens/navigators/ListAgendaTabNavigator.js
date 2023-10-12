import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Home from "../Home";
import Ionicons from '@expo/vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function ListAgendaTabNavigator() {
	return (
		<Tab.Navigator>
			<Tab.Screen
				name={"Home"}
				component={Home}
				options={
					{
						title: 'Home',
						headerShown: false,
						tabBarIcon: ({color, size}) => (
							<Ionicons name="home" size={size} color={color}/>
						)
					}
				}
			/>
			<Tab.Screen
				name={"Agenda"}
				component={Home}
				options={
					{
						title: 'Agenda',
						headerShown: false,
						tabBarIcon: ({color, size}) => (
							<Ionicons name="calendar" size={size} color={color}/>
						)
					}
				}
			/>
		</Tab.Navigator>
	)
};