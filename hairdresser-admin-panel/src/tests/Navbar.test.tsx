import {describe, expect} from "vitest";
import {render, waitFor} from "@testing-library/react";
import {Provider} from "react-redux";
import {createNewStore} from "../redux/store.ts";
import App from "../App.tsx";
import userEvent from '@testing-library/user-event'

describe("Logged out navbar tests", () => {
	it('should render the logged out navbar', async () => {
		const app = render(
			<Provider store={createNewStore()}>
				<App/>
			</Provider>
		);

		expect(await app.findByTestId("nav-appointments-link")).toBeVisible();
		expect(await app.findByTestId("nav-clients-link")).toBeVisible();
		expect(await app.findByTestId("nav-services-link")).toBeVisible();
		expect(await app.findByTestId("nav-users-link")).toBeVisible();

		expect(await app.findByTestId("nav-login-link")).toBeVisible();
	});

	it('should render the logged in navbar', async () => {
		const app = render(
			<Provider store={createNewStore()}>
				<App/>
			</Provider>
		);

		expect(await app.findByTestId("nav-appointments-link")).toBeVisible();
		expect(await app.findByTestId("nav-clients-link")).toBeVisible();
		expect(await app.findByTestId("nav-services-link")).toBeVisible();
		expect(await app.findByTestId("nav-users-link")).toBeVisible();

		expect(await app.findByTestId("nav-login-link")).toBeVisible();
	});

	it('should navigate to all the routes in the navbar', async () => {
		const app = render(
			<Provider store={createNewStore()}>
				<App/>
			</Provider>
		);

		await userEvent.click(await app.findByTestId("nav-login-link"));

		await userEvent.type(app.getByTestId("username-input"), "INatsuz");
		await userEvent.type(app.getByTestId("password-input"), "25.09.1999");
		await userEvent.click(app.getByTestId("login-submit-btn"));

		await waitFor(async () => expect(await app.findByTestId("nav-username-link")).toHaveTextContent("INatsuz"));

		await userEvent.click(await app.findByTestId("nav-appointments-link"));
		await waitFor(async () => expect(await app.findByTestId("appointments-table")).toBeVisible());

		await userEvent.click(await app.findByTestId("nav-services-link"));
		await waitFor(async () => expect(await app.findByTestId("services-table")).toBeVisible());

		await userEvent.click(await app.findByTestId("nav-clients-link"));
		await waitFor(async () => expect(await app.findByTestId("clients-table")).toBeVisible());

		await userEvent.click(await app.findByTestId("nav-users-link"));
		await waitFor(async () => expect(await app.findByTestId("users-table")).toBeVisible());
	});
});