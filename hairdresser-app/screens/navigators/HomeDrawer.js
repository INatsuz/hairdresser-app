import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from "../Home";
import Clients from "../Clients";

const Drawer = createDrawerNavigator();

export default function HomeDrawer() {
	return (
		<Drawer.Navigator screenOptions={{swipeEnabled: true, swipeEdgeWidth: 100}}>
		 	<Drawer.Screen name="Home" component={Home} options={{headerShown: false}}/>
			<Drawer.Screen name="Clients" component={Clients} />
		</Drawer.Navigator>
	);
}
