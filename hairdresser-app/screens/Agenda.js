import {SafeAreaView} from "react-native";
import commonStyles from "../styles/commonStyles";
import AppointmentAgenda from "../components/AppointmentAgenda/AppointmentAgenda";

export default function Agenda() {
	return (
		<SafeAreaView style={[commonStyles.topPaddingContainer, commonStyles.flex1Container]}>
			<AppointmentAgenda/>
		</SafeAreaView>
	)
};