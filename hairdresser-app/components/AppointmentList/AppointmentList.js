import {FlatList, SafeAreaView, StyleSheet, Text, View} from "react-native";
import AssignmentListItem from "./AppointmentListItem";
import React, {useEffect, useState} from "react";
import {useIsFocused} from "@react-navigation/native";

export default function AppointmentList(props) {
	const [refreshing, setRefreshing] = useState(true);
	const isFocused = useIsFocused();

	useEffect(function () {
		if (isFocused) {
			setRefreshing(true);
			props.fetchAppointments().then(() => {
				setRefreshing(false);
			}).catch(err => {
				console.log(err);
			});
		}
	}, [isFocused]);


	return (
		<SafeAreaView style={styles.container}>

			<View style={styles.titleContainer}>
				<Text style={styles.title}>{!props.title ? "Your Appointments:" : props.title}</Text>
			</View>
			<FlatList
				data={props.appointments}
				renderItem={({item}) => <AssignmentListItem key={item.id} data={item} onItemPress={props.onItemPress}/>}
				refreshing={refreshing}
				onRefresh={() => {
					setRefreshing(true);
					props.fetchAppointments().then(() => {
						setRefreshing(false);
					});
				}}
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
	}
});