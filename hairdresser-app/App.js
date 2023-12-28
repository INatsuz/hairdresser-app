import {StatusBar, View} from 'react-native';
import {Provider} from "react-redux";
import {store} from "./redux/store";
import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import LoginTabStackNavigator from "./screens/navigators/LoginTabStackNavigator";
import commonStyles from "./styles/commonStyles";
import {navigationRef} from "./utils/NavigationRef";
import {MenuProvider} from "react-native-popup-menu";

const Tab = createBottomTabNavigator();

export default function App() {
	return (
		<MenuProvider>
			<View style={[commonStyles.flex1Container, {backgroundColor: "white"}]}>
				<StatusBar backgroundColor={"white"} translucent={true}/>
				<Provider store={store}>
					<NavigationContainer ref={navigationRef}>
						<LoginTabStackNavigator/>
					</NavigationContainer>
				</Provider>
			</View>
		</MenuProvider>
	);
}
