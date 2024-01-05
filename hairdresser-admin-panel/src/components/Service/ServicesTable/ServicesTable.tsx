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
			<table className={"table table-striped table-hover"} data-testid={"services-table"}>
				<thead>
					<tr>
						<th>ID</th>
						<th>Nome</th>
						<th>Preço</th>
						<th>Tempo Estimado</th>
						<th>Cor</th>
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
