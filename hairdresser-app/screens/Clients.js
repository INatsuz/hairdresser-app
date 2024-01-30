import {SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import commonStyles from "../styles/commonStyles";
import PlusCircle from "../components/PlusCircle/PlusCircle";
import useClients from "../hooks/useClients";
import ClientList from "../components/ClientList/ClientList";
import {useEffect, useState} from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Clients({navigation}) {

	const [clients, , fetchClients] = useClients();
	const [searchText, setSearchText] = useState("");

	function getFilteredClients() {
		let filteredClients = undefined;
		if (searchText.trim().length > 0) {
			const predicate = (client) => {
				if (client.name.toLowerCase().includes(searchText.toLowerCase())) {
					return true;
				} else return client.phone.includes(searchText);
			}

			return clients.filter(predicate);
		} else {
			return clients;
		}

	}

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<View style={styles.searchContainer}>
					<TextInput onChangeText={text => setSearchText(text)} style={styles.searchInput}/>
					<View style={styles.searchButton} onPress={() => setIsModalVisible(true)}>
						<Ionicons name="search" size={20} color={"black"}/>
					</View>
				</View>
			)
		});
	}, []);

	function navigateToEdit(data) {
		data.birthday = data.birthday.toISOString();
		navigation.navigate('EditClient', {data: data});
	}

	return (
		<SafeAreaView style={[styles.container, commonStyles.relativeContainer, commonStyles.flex1Container]}>
			<ClientList clients={getFilteredClients()} fetchClients={fetchClients} onItemPress={navigateToEdit}/>
			<View style={styles.plusContainer}>
				<PlusCircle/>
			</View>
		</SafeAreaView>
	)
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white"
	},

	searchContainer: {
		borderWidth: 1,
		borderColor: "gray",
		borderRadius: 4,
		display: "flex",
		flexDirection: "row",
		marginRight: 15,
		justifyContent: "center",
		alignItems: "center",
	},

	searchButton: {
		paddingRight: 5
	},

	searchInput: {
		fontSize: 16,
		padding: 3,
		paddingHorizontal: 8,
		marginBottom: 0,
		width: 100
	},

	plusContainer: {
		position: "absolute",
		bottom: 10,
		right: 10
	},
});
