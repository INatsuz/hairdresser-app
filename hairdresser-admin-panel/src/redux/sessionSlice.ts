import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface SessionState {
	loggedIn: boolean | null;
	user: SessionUser;
}

export interface SessionUser {
	ID: number,
	username: string
}

const initialState: SessionState = {
	loggedIn: null,
	user: {
		ID: -1,
		username: ""
	}
}

export const sessionSlice = createSlice({
	name: "session",
	initialState,
	reducers: {
		login: (state, action: PayloadAction<SessionUser>) => {
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