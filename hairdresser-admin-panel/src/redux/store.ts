import {configureStore} from "@reduxjs/toolkit";
import {sessionReducer} from "./sessionSlice.ts";

export const store = configureStore({
	reducer: {
		session: sessionReducer
	}
});

export const createNewStore = () => {
	return configureStore({
		reducer: {
			session: sessionReducer
		}
	});
}

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch