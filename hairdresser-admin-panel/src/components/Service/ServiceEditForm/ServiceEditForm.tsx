import React, {useState} from 'react'
import {useLocation, useNavigate} from "react-router-dom";
import {putWithAuth} from "../../../utils/requester.ts";
import Service from "../../../types/Service.ts";

const ServiceEditForm: React.FC = () => {

	const navigate = useNavigate();
	const {state: {service}}: {state: {service: Service}} = useLocation();

	const [name, setName] = useState<string>(service.name);
	const [price, setPrice] = useState<number>(service.price);
	const [estimatedTime, setEstimatedTime] = useState<number>(service.estimatedTime);
	const [color, setColor] = useState<string>(service.color);
	function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
		// Cancelling the submit event so page won't reload
		e.preventDefault();

		if (name.trim().length === 0) {
			return;
		}

		if (isNaN(price)) {
			return;
		}
		if (isNaN(estimatedTime)) {
			return;
		}

		putWithAuth("/api/editService", {
			ID: service.ID,
			name: name.trim(),
			price,
			estimatedTime,
			color
		}).then(() => {
			navigate("/services");
		});

	}

	return (
		<>
			<form className={"bg-light rounded p-3 shadow"} onSubmit={handleSubmit}>
				<div className={"mb-3"}>
					<label htmlFor="name" className="form-label">Nome</label>
					<input type="text" id={"name"} value={name} name={"name"} className={"form-control"} onChange={e => setName(e.target.value)}/>
					{
						name.trim() === "" &&
						<div className="alert alert-danger p-2 mt-2" role={"alert"}>
							Este campo não pode ser deixado vazio.
						</div>
					}
				</div>
				<div className={"mb-3"}>
					<label htmlFor="price" className="form-label">Preço</label>
					<input type="number" min={0} step={0.01} id={"price"} value={isNaN(price) ? "" : (price / 100)} name={"price"} className={"form-control"} onChange={e => setPrice(parseFloat(e.target.value) * 100)}/>
					{
						isNaN(price) &&
						<div className="alert alert-danger p-2 mt-2" role={"alert"}>
							Este campo não pode ser deixado vazio.
						</div>
					}
				</div>
				<div className={"mb-3"}>
					<label htmlFor="time" className="form-label">Tempo Estimado</label>
					<input type="number" min={0} step={1} id={"time"} value={isNaN(estimatedTime) ? "" : estimatedTime.toFixed(0)} name={"time"} className={"form-control"} onChange={e => setEstimatedTime(parseInt(e.target.value))}/>
					{
						isNaN(estimatedTime) &&
						<div className="alert alert-danger p-2 mt-2" role={"alert"}>
							Este campo não pode ser deixado vazio.
						</div>
					}
				</div>
				<div className={"mb-3"}>
					<label htmlFor="color" className="form-label">Cor</label>
					<input type="color" id={"color"} value={color} name={"color"} className={"form-control form-control-color"} onChange={e => setColor(e.target.value)}/>
				</div>
				<div>
					<button type={"submit"} className="btn btn-success">Editar</button>
				</div>
			</form>
		</>
	);
}

export default ServiceEditForm
