import {render} from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import App from "../App.tsx";
import {expect} from "vitest";

describe("App tests", () => {
	test('Logos present', async () => {
		const app = render(<App/>);
		const user = userEvent.setup();
		const button = app.getByTestId("counter-button");
		await user.click(button);

		expect(button).toHaveTextContent("1");
	});
});
