import React, {useEffect, useRef, useState} from 'react'
import {useLocation, useNavigate} from "react-router-dom";
import useClients from "../../../hooks/useClients.ts";
import useServices from "../../../hooks/useServices.ts";
import useUsers from "../../../hooks/useUsers.ts";
import Combobox from "react-widgets/Combobox";
import "react-widgets/styles.css";
import Client from "../../../types/Client.ts";
import Service from "../../../types/Service.ts";
import User from "../../../types/User.ts";
import {putWithAuth} from "../../../utils/requester.ts";
import Appointment from "../../../types/Appointment.ts";

const AppointmentEditForm: React.FC = () => {

	const {state: {appointment}}: { state: { appointment: Appointment } } = useLocation();

	const navigate = useNavigate();
	const [services] = useServices();
	const [clients] = useClients();
	const [users] = useUsers();

	const [service, setService] = useState<Service>();
	const [clientComboText, setClientComboText] = useState<string | Client>();
	const [client, setClient] = useState<Client>();
	const [user, setUser] = useState<User>();
	const [timeStart, setTimeStart] = useState<Date>(new Date(appointment.timeStart));
	const [timeEnd, setTimeEnd] = useState<Date>(new Date(appointment.timeEnd));
	const [price, setPrice] = useState<number>(appointment.price);
	const [observations, setObservations] = useState<string>(appointment.observations);

	const comboText = useRef<string>(appointment.clientName);

	useEffect(() => {
		if (users.length > 0) {
			setUser(users.find(u => u.ID === appointment.assignedUser));
		}
	}, [appointment.assignedUser, users]);

	useEffect(() => {
		if (services.length > 0) {
			setService(services.find(s => s.ID === appointment.serviceID));
		}
	}, [services]);

	useEffect(() => {
		if (clients.length > 0) {
			const foundClient: Client | undefined = clients.find(c => c.ID === appointment.clientID);
			setClient(foundClient);
			setClientComboText(foundClient);
		}
	}, [appointment.clientID, clients]);

	useEffect(() => {
		if (service !== undefined) {
			const endDate = new Date(timeStart);
			endDate.setMinutes(endDate.getMinutes() + service.estimatedTime);
			setTimeEnd(endDate);
		}
	}, [timeStart]);

	useEffect(() => {
		if (service !== undefined && service.ID !== appointment.serviceID) {
			appointment.serviceID = -1;
			const endDate = new Date(timeStart);
			endDate.setMinutes(endDate.getMinutes() + service.estimatedTime);
			setTimeEnd(endDate);
			setPrice(service.price);
		}
	}, [service]);

	function dateToDatetimeString(date: Date): string {
		return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${(date.getDate()).toString().padStart(2, '0')}T${(date.getHours()).toString().padStart(2, '0')}:${(date.getMinutes()).toString().padStart(2, '0')}`;
	}

	function handleSetTimeStart(event: React.ChangeEvent<HTMLInputElement>): void {
		console.log(event);
		setTimeStart(new Date(event.target.value));
	}

	function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
		// Cancelling the submit event so page won't reload
		e.preventDefault();

		if (comboText.current === "") {
			return;
		}
		if (isNaN(timeStart.getTime())) {
			return;
		}
		if (isNaN(timeEnd.getTime())) {
			return;
		}

		if (client && service) {
			putWithAuth("/api/editAppointment", {
				ID: appointment.ID,
				service: service.ID,
				client: client.ID,
				assignedUser: user ? user.ID : null,
				price: price,
				timeStart: `${timeStart.getUTCFullYear()}-${timeStart.getUTCMonth() + 1}-${timeStart.getUTCDate()} ${timeStart.getUTCHours()}:${timeStart.getUTCMinutes()}:00`,
				timeEnd: `${timeEnd.getUTCFullYear()}-${timeEnd.getUTCMonth() + 1}-${timeEnd.getUTCDate()} ${timeEnd.getUTCHours()}:${timeEnd.getUTCMinutes()}:00`,
				observations: observations.trim()
			}).then(() => {
				navigate("/appointments");
			});
		}
	}

	return (
		<>
			<form className={"bg-light rounded p-3 shadow"} onSubmit={handleSubmit}>
				<div className={"mb-3"}>
					<label htmlFor="service" className="form-label">Serviço</label>
					<select name="service" id={"service"} value={service?.ID} className={"form-select"} onChange={e => setService(services.find(v => v.ID === parseInt(e.target.value)))}>
						{
							services.map(service => <option value={service.ID} key={service.ID}>{service.name}</option>)
						}
					</select>
				</div>
				<div className={"mb-3"}>
					<label htmlFor="client" className="form-label">Cliente</label>
					<Combobox value={clientComboText} data={clients} textField={"name"} dataKey={"ID"} hideEmptyPopup={false} filter={(c, searchTerm) => {
						return `${c.name} ${c.phone}`.toLowerCase().includes(searchTerm.toLowerCase());
					}} onChange={value => {
						comboText.current = value as string;
						setClientComboText(value);
					}} onSelect={value => setClient(value as Client)} onToggle={isOpen => {
						if (!isOpen) {
							if (comboText.current !== "") {
								setClientComboText(client);
							}
						}
					}}/>
					{
						clientComboText === "" &&
						<div className="alert alert-danger p-2 mt-2" role={"alert"}>
							Este campo não pode ser deixado vazio.
						</div>
					}
				</div>
				<div className={"mb-3"}>
					<label htmlFor="timeStart" className="form-label">Data/Hora de Início</label>
					<input type="datetime-local" id={"timeStart"} value={dateToDatetimeString(timeStart)} name={"timeStart"} className={"form-control"} onChange={handleSetTimeStart}/>
					{
						isNaN(timeStart.getTime()) &&
						<div className="alert alert-danger p-2 mt-2" role={"alert"}>
							Este campo não pode ser deixado vazio.
						</div>
					}
				</div>
				<div className={"mb-3"}>
					<label htmlFor="timeEnd" className="form-label">Data/Hora de Fim</label>
					<input type="datetime-local" id={"timeEnd"} value={dateToDatetimeString(timeEnd)} name={"timeEnd"} className={"form-control"} onChange={e => setTimeEnd(new Date(e.target.value))}/>
					{
						isNaN(timeStart.getTime()) &&
						<div className="alert alert-danger p-2 mt-2 mb-0" role={"alert"}>
							Este campo não pode ser deixado vazio.
						</div>
					}
					<div className="alert alert-warning p-2 mt-2" role={"alert"}>
						Atenção: Ao alterar o serviço escolhido ou a hora inicial, a hora final é
						automaticamente preenchida com a hora inicial mais o tempo estimado do serviço.
					</div>
				</div>
				<div className={"mb-3"}>
					<label htmlFor="price" className="form-label">Preço</label>
					<input type="number" min={0} step={0.01} id={"price"} value={isNaN(price) ? "" : (price / 100)} name={"price"} className={"form-control"} onChange={e => setPrice(parseFloat(e.target.value) * 100)}/>
					<div className="alert alert-warning p-2 mt-2" role={"alert"}>
						Atenção: Ao alterar o serviço, o preço é automaticamente preenchido com o preço do serviço.
					</div>
				</div>
				<div className={"mb-3"}>
					<label htmlFor="assignedUser" className="form-label">Fisioterapeuta</label>
					<select name="assignedUser" id={"assignedUser"} value={user?.ID} className={"form-select"} onChange={e => setUser(users.find(v => v.ID === parseInt(e.target.value)))}>
						<option value="null">No Assigned User</option>
						{
							users.map(user => <option value={user.ID} key={user.ID}>{user.name}</option>)
						}
					</select>
				</div>
				<div className={"mb-3"}>
					<label htmlFor="observations" className="form-label">Observações</label>
					<textarea value={observations} name="observations" id="observations" rows={3} className={"form-control"} onChange={e => setObservations(e.target.value)}/>
				</div>
				<div>
					<button type={"submit"} className="btn btn-success">Editar</button>
				</div>
			</form>
		</>
	);
}

export default AppointmentEditForm
