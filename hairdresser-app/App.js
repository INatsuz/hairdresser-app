import {StatusBar} from 'expo-status-bar';
import {StyleSheet, useColorScheme, View} from 'react-native';
import {Provider} from "react-redux";
import {store} from "./redux/store";
import {createNavigationContainerRef, DarkTheme, DefaultTheme, NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import LoginTabStackNavigator from "./screens/navigators/LoginTabStackNavigator";

const navigationRef = createNavigationContainerRef();

const Tab = createBottomTabNavigator();

export default function App() {
	const colorScheme = useColorScheme();

	return (
		<Provider store={store}>
				<NavigationContainer ref={navigationRef} theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
					<LoginTabStackNavigator/>
				</NavigationContainer>
		</Provider>
	);
}
