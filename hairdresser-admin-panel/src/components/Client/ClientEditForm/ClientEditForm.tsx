import React, {useState} from 'react'
import {useLocation, useNavigate} from "react-router-dom";
import {putWithAuth} from "../../../utils/requester.ts";
import Client from "../../../types/Client.ts";

const phoneRegex = /^\+?\d+$/gm;

const ClientEditForm: React.FC = () => {

	const navigate = useNavigate();
	const {state: {client}}: {state: {client: Client}} = useLocation();

	const [name, setName] = useState<string>(client.name);
	const [phone, setPhone] = useState<string>(client.phone);

	function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
		// Cancelling the submit event so page won't reload
		e.preventDefault();

		if (!name || name.trim() === "") {
			return;
		}
		if (phone.trim() !== "" && phone.replace(/ /g, "").match(phoneRegex) === null) {
			return;
		}

		putWithAuth("/api/editClient", {
			ID: client.ID,
			name: name.trim(),
			phone: phone.replace(/ /g, "")
		}).then(() => {
			navigate("/clients");
		});

	}

	return (
		<>
			<form className={"bg-light rounded p-3 shadow"} onSubmit={handleSubmit}>
				<div className={"mb-3"}>
					<label htmlFor="name" className="form-label">Name</label>
					<input type="text" id={"name"} value={name} name={"name"} className={"form-control"} onChange={e => setName(e.target.value)}/>
					{
						name.trim() === "" &&
						<div className="alert alert-danger p-2 mt-2" role={"alert"}>
							This field cannot be left empty.
						</div>
					}
				</div>
				<div className={"mb-3"}>
					<label htmlFor="phone" className="form-label">Phone</label>
					<input type="text" id={"phone"} value={phone} name={"phone"} className={"form-control"} onChange={e => setPhone(e.target.value)}/>
					{
						phone.trim() !== "" && phone.replace(/ /g, "").match(phoneRegex) === null &&
						<div className="alert alert-danger p-2 mt-2" role={"alert"}>
							The phone number you inserted is invalid.
						</div>
					}
				</div>
				<div>
					<button type={"submit"} className="btn btn-success">Create</button>
				</div>
			</form>
		</>
	);
}

export default ClientEditForm
