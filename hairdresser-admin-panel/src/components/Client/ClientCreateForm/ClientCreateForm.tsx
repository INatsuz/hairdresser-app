import React, {useRef, useState} from 'react'
import {useNavigate} from "react-router-dom";
import {postWithAuth} from "../../../utils/requester.ts";

const phoneRegex = /^\+?\d+$/gm;

const ClientCreateForm: React.FC = () => {

	const navigate = useNavigate();

	const [name, setName] = useState<string>("");
	const [phone, setPhone] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const birthday = useRef<Date | null>(new Date());
	const [birthdayString, setBirthdayString] = useState<string>(dateToDateString(birthday.current));
	const [nif, setNif] = useState<string>("");
	const [observations, setObservations] = useState<string>("");

	function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
		// Cancelling the submit event so page won't reload
		e.preventDefault();

		if (!name || name.trim() === "") {
			return;
		}
		if (phone.trim() !== "" && phone.replace(/ /g, "").match(phoneRegex) === null) {
			return;
		}

		postWithAuth("/api/addClient", {
			name: name.trim(),
			phone: phone.replace(/ /g, ""),
			email: email?.trim(),
			birthday: birthday.current && !isNaN(birthday.current.getDate()) ? dateToDateString(birthday.current) : null,
			nif: nif?.trim(),
			observations: observations.trim()
		}).then(() => {
			navigate("/clients");
		});

	}

	function dateToDateString(date: Date | null): string {
		if (date === null) {
			return "";
		}
		return date ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${(date.getDate()).toString().padStart(2, '0')}` : "";
	}

	function handleSetBirthday(e: React.ChangeEvent<HTMLInputElement>) {
		setBirthdayString(e.target.value);
		const tempDate = new Date(e.target.value);
		if (!isNaN(tempDate.getDate())) {
			birthday.current = tempDate;
		} else {
			birthday.current = null;
		}
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
				<div className={"mb-3"}>
					<label htmlFor="email" className="form-label">Email</label>
					<input type="email" id={"email"} value={email} name={"email"} className={"form-control"} onChange={e => setEmail(e.target.value)}/>
				</div>
				<div className={"mb-3"}>
					<label htmlFor="birthday" className="form-label">Birthday</label>
					<input type="date" id={"birthday"} value={birthdayString} name={"birthday"} className={"form-control"} onChange={handleSetBirthday}/>
				</div>
				<div className={"mb-3"}>
					<label htmlFor="nif" className="form-label">NIF</label>
					<input type="text" id={"nif"} value={nif} name={"nif"} className={"form-control"} onChange={e => setNif(e.target.value)}/>
				</div>
				<div className={"mb-3"}>
					<label htmlFor="observations" className="form-label">Observations</label>
					<textarea value={observations} name="observations" id="observations" rows={3} className={"form-control"} onChange={e => setObservations(e.target.value)} />
				</div>
				<div>
					<button type={"submit"} className="btn btn-success">Create</button>
				</div>
			</form>
		</>
	);
}

export default ClientCreateForm
