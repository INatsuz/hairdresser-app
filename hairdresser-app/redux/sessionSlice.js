import {createSlice} from "@reduxjs/toolkit";


const initialState = {
	loggedIn: false,
	user: {
		ID: null,
		username: null,
		name: null,
		userType: null
	}
}

export const sessionSlice = createSlice({
	name: "session",
	initialState,
	reducers: {
		login: (state, action) => {
			state.loggedIn = true;
			state.user = action.payload;
		},
		logout: (state) => {
			state.loggedIn = false;
			state.user = initialState.user;
		}
	}
});

export const {login, logout} = sessionSlice.actions;
export const sessionReducer = sessionSlice.reducer;