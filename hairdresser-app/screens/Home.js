import {View, Text, Button} from "react-native";
import commonStyles from "../styles/commonStyles";
import {deleteTokens} from "../utils/TokenManager";
import {useDispatch} from "react-redux";
import {logout} from "../redux/sessionSlice";

export default function Home({navigation}) {

	const dispatch = useDispatch();

	function handleLogoutPress() {
		deleteTokens().then(() => {
			dispatch(logout());
			navigation.reset({
				index: 0,
				routes: [{name: "Login"}]
			});
		});
	}

	return(
		<View style={commonStyles.topPaddingContainer}>
			<Text>Hello There</Text>
			<Button title={"Log out"} onPress={handleLogoutPress}/>
		</View>
	)
};