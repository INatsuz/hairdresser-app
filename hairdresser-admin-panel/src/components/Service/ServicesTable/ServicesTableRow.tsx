import React from "react";
import Service from "../../../types/Service.ts";
import {useNavigate} from "react-router-dom";

interface ServicesTableRowProps {
	service: Service;
	deleteService: (service: Service) => void;
}

const ServicesTableRow: React.FC<ServicesTableRowProps> = ({service, deleteService}) => {

	const navigate = useNavigate();

	function handleDeleteClick() {
		if (confirm("Are you sure?")) {
			deleteService(service);
		}
	}

	function handleEditClick() {
		navigate("edit", {
			state: {
				service: service
			}
		});
	}

	return (
		<>
			<tr>
				<td>{service.ID}</td>
				<td>{service.name}</td>
				<td>€{(service.price / 100).toFixed(2)}</td>
				<td>{service.estimatedTime} minutes</td>
				<td className={"text-end"}>
					<button className={"btn btn-sm btn-primary me-2"}><i className={"bi-list"}></i></button>
					<button className={"btn btn-sm btn-warning me-2"}><i className={"bi-pencil"} onClick={handleEditClick}></i></button>
					<button className={"btn btn-sm btn-danger me-2"} onClick={handleDeleteClick}><i className={"bi-trash"}></i></button>
				</td>
			</tr>
		</>
	)
}

export default ServicesTableRow;
