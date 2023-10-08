import React from "react";
import ServicesTableRow from "./ServicesTableRow.tsx";
import Service from "../../../types/Service.ts";
import {deleteWithAuth} from "../../../utils/requester.ts";

interface ServicesTableProps {
	services: Service[];
	setServices: React.Dispatch<React.SetStateAction<Service[]>>;
}

const ServicesTable: React.FC<ServicesTableProps> = ({services, setServices}) => {
	function deleteService(service: Service) {
		deleteWithAuth(`/api/deleteService/${service.ID}`).then(() => {
			const newList: Service[] = services.filter(se => se.ID !== service.ID);

			setServices(newList);
		});
	}

	return (
		<>
			<table className={"table table-striped table-hover"}>
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Price</th>
						<th>Estimated Time</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{
						services.map(service => <ServicesTableRow service={service} key={service.ID} deleteService={deleteService}/>)
					}
				</tbody>
			</table>
		</>
	)
}

export default ServicesTable;
