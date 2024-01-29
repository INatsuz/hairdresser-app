import {FlatList, SafeAreaView, StyleSheet, Text, View} from "react-native";
import ClientListItem from "./ClientListItem";
import React, {useEffect, useState} from "react";
import {useIsFocused} from "@react-navigation/native";

export default function ClientList(props) {
	const [refreshing, setRefreshing] = useState(true);
	const isFocused = useIsFocused();

	useEffect(function () {
		if (isFocused) {
			setRefreshing(true);
			props.fetchClients().then(() => {
				setRefreshing(false);
			}).catch(err => {
				console.log(err);
			});
		}
	}, [isFocused]);


	return (
		<SafeAreaView style={styles.container}>
			<FlatList
				data={props.clients}
				renderItem={({item}) => <ClientListItem key={item.id} data={item} onItemPress={props.onItemPress}/>}
				refreshing={refreshing}
				onRefresh={() => {
					setRefreshing(true);
					props.fetchClients().then(() => {
						setRefreshing(false);
					});
				}}
				ItemSeparatorComponent={() => <View style={styles.listSeparator}></View>}
				ListFooterComponent={() => <View style={{height: 35}}></View>}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		height: "100%",
		paddingBottom: 2
	},

	titleContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 15,
		paddingTop: 7,
		paddingBottom: 7,
	},

	iconContainer: {
		display: "flex",
		flexDirection: "row",
	},

	searchButton: {
		marginStart: 10
	},

	title: {
		color: "black",
		fontSize: 20,
		fontWeight: "bold",
	},

	listSeparator: {
		borderBottomColor: "lightgray",
		borderBottomWidth: 1
	}
});
