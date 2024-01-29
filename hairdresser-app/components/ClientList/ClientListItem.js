import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {memo} from 'react';

function ClientListItem(props) {
	return (
		<TouchableOpacity style={styles.itemContainer} delayPressIn={20} onPress={() => props.onItemPress(props.data)}>
			<Text style={styles.textStyle}>{props.data.name}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	itemContainer: {
		padding: 10
	},

	textStyle: {
		color: "black",
		fontSize: 17
	}
});

export default memo(ClientListItem)
