import {describe, expect} from "vitest";
import {fireEvent, render, waitFor, within} from "@testing-library/react";
import {Provider} from "react-redux";
import {createNewStore, store} from "../redux/store.ts";
import {MemoryRouter, Route, Routes} from "react-router-dom";
import Login from "../pages/Login.tsx";
import Appointments from "../pages/Appointment/Appointments.tsx";
import userEvent from "@testing-library/user-event";

describe("Login form tests", () => {

	it('should render the login form', async () => {
		const loginPage = render(
			<Provider store={store}>
				<MemoryRouter initialEntries={["/login"]}>
					<Routes>
						<Route path={"/login"} element={<Login/>}/>
					</Routes>
				</MemoryRouter>
			</Provider>
		);

		const loginLinkEl = await loginPage.findByTestId("nav-login-link");
		expect(loginLinkEl).toBeVisible();

		const loginForm = loginPage.getByTestId("login-form");

		// Checking that login form is visible and has 3 child nodes (divs that contain the labels and inputs)
		expect(loginForm).toBeVisible();
		expect(loginForm.childNodes).toHaveLength(3);

		// Checking for username label and input to be visible
		expect(within(loginForm).getByTestId("username-label")).toBeVisible();
		expect(within(loginForm).getByTestId("username-input")).toBeVisible();

		// Checking for username label and input to be visible
		expect(within(loginForm).getByTestId("password-label")).toBeVisible();
		expect(within(loginForm).getByTestId("password-input")).toBeVisible();

		// Checking for submit button to be visible
		expect(within(loginForm).getByTestId("login-submit-btn")).toBeVisible();
	});

	it('should log in successfully', async () => {
		const app = render(
			<Provider store={createNewStore()}>
				<MemoryRouter initialEntries={["/login"]}>
					<Routes>
						<Route path={"/login"} element={<Login/>}/>
						<Route path={"/appointments"} element={<Appointments/>}/>
					</Routes>
				</MemoryRouter>
			</Provider>
		);

		// Checking for username label and input to be visible
		fireEvent.change(app.getByTestId("username-input"), {target: {value: "INatsuz"}});
		fireEvent.change(app.getByTestId("password-input"), {target: {value: "25.09.1999"}});
		fireEvent.click(app.getByTestId("login-submit-btn"));

		await waitFor(async () => expect(await app.findByTestId("nav-username-link")).toHaveTextContent("INatsuz"));
	});

	it('should fail to log in', async () => {
		const app = render(
			<Provider store={createNewStore()}>
				<MemoryRouter initialEntries={["/login"]}>
					<Routes>
						<Route path={"/login"} element={<Login/>}/>
						<Route path={"/appointments"} element={<Appointments/>}/>
					</Routes>
				</MemoryRouter>
			</Provider>
		);

		// Checking for username label and input to be visible
		fireEvent.change(app.getByTestId("username-input"), {target: {value: "INatsuz"}});
		fireEvent.change(app.getByTestId("password-input"), {target: {value: "01.10.1966"}});
		fireEvent.click(app.getByTestId("login-submit-btn"));

		const el = await app.findByTestId("failed-login-alert");
		expect(el).toBeVisible();
	});

	it('should log out successfully', async () => {
		const app = render(
			<Provider store={createNewStore()}>
				<MemoryRouter initialEntries={["/login"]}>
					<Routes>
						<Route path={"/login"} element={<Login/>}/>
						<Route path={"/appointments"} element={<Appointments/>}/>
					</Routes>
				</MemoryRouter>
			</Provider>
		);

		await userEvent.type(app.getByTestId("username-input"), "INatsuz");
		await userEvent.type(app.getByTestId("password-input"), "25.09.1999");
		await userEvent.click(app.getByTestId("login-submit-btn"));

		const usernameEl = await app.findByTestId("nav-username-link");
		expect(usernameEl).toHaveTextContent("INatsuz");

		const logoutLinkEl = app.getByTestId("nav-logout-link");
		fireEvent.click(logoutLinkEl);

		await waitFor(async () => expect(await app.findByTestId("nav-login-link")).toBeVisible());

	});
})