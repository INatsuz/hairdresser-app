import 'react-native-gesture-handler';
import {StatusBar, View} from 'react-native';
import {Provider} from "react-redux";
import {store} from "./redux/store";
import {NavigationContainer} from "@react-navigation/native";
import LoginTabStackNavigator from "./screens/navigators/LoginTabStackNavigator";
import commonStyles from "./styles/commonStyles";
import {navigationRef} from "./utils/NavigationRef";
import {MenuProvider} from "react-native-popup-menu";
import {ActionSheetProvider} from "@expo/react-native-action-sheet";

export default function App() {
	return (
		<ActionSheetProvider>
			<MenuProvider>
				<View style={[commonStyles.flex1Container, {backgroundColor: "white"}]}>
					<StatusBar backgroundColor={"white"} barStyle={"dark-content"} translucent={true}/>
					<Provider store={store}>
						<NavigationContainer ref={navigationRef}>
							<LoginTabStackNavigator/>
						</NavigationContainer>
					</Provider>
				</View>
			</MenuProvider>
		</ActionSheetProvider>
	);
}
