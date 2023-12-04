import {StatusBar, View} from 'react-native';
import {Provider} from "react-redux";
import {store} from "./redux/store";
import {createNavigationContainerRef, NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import LoginTabStackNavigator from "./screens/navigators/LoginTabStackNavigator";
import commonStyles from "./styles/commonStyles";

export const navigationRef = createNavigationContainerRef();

const Tab = createBottomTabNavigator();

export default function App() {
	return (
		<View style={[commonStyles.flex1Container, {backgroundColor: "white"}]}>
			<StatusBar backgroundColor={"white"} translucent={true}/>
			<Provider store={store}>
				<NavigationContainer ref={navigationRef}>
					<LoginTabStackNavigator/>
				</NavigationContainer>
			</Provider>
		</View>
	);
}
