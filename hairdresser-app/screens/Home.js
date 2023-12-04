import {SafeAreaView, StyleSheet} from "react-native";
import commonStyles from "../styles/commonStyles";
import {deleteTokens} from "../utils/TokenManager";
import {useDispatch} from "react-redux";
import {logout} from "../redux/sessionSlice";
import UserSection from "../components/UserSection/UserSection";
import AppointmentList from "../components/AppointmentList/AppointmentList";
import PlusCircle from "../components/PlusCircle/PlusCircle";
import useAppointments from "../hooks/useAppointments";

export default function Home({navigation}) {

	const dispatch = useDispatch();
	const [appointments, , fetchAppointments] = useAppointments(true);

	function handleLogoutPress() {
		deleteTokens().then(() => {
			dispatch(logout());
			navigation.reset({
				index: 0,
				routes: [{name: "Login"}]
			});
		});
	}

	function navigateToEdit(data) {
		navigation.navigate('Edit', {data: data});
	}

	return (
		<SafeAreaView style={[styles.container, commonStyles.topPaddingContainer, commonStyles.relativeContainer, commonStyles.flex1Container]}>
			<UserSection onLogoutPress={handleLogoutPress}/>
			<AppointmentList appointments={appointments} fetchAppointments={fetchAppointments} onItemPress={navigateToEdit}/>
			<PlusCircle/>
		</SafeAreaView>
	)
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white"
	}
});
