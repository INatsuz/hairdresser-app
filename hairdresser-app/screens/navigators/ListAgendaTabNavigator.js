import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Home from "../Home";
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeStackNavigator from "./HomeStackNavigator";
import AppointmentAgenda from "../../components/AppointmentAgenda/AppointmentAgenda";
import Agenda from "../Agenda";

const Tab = createBottomTabNavigator();

export default function ListAgendaTabNavigator() {
	return (
		<Tab.Navigator>
			<Tab.Screen
				name={"HomeStackNavigator"}
				component={HomeStackNavigator}
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
				component={Agenda}
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