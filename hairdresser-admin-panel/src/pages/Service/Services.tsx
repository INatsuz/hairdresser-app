import React from 'react'
import Navbar from "../../components/Navbar/Navbar.tsx";
import AuthRequired from "../../components/Auth/AuthRequired.tsx";
import ServicesTable from "../../components/Service/ServicesTable/ServicesTable.tsx";
import useServices from "../../hooks/useServices.ts";
import {Link} from "react-router-dom";

const Services: React.FC = () => {

	const [services, setServices] = useServices();

	return (
		<>
			<Navbar/>
			<AuthRequired>
				<div className="container py-4">
					<Link to={"create"}>
						<button className={"btn btn-success mb-2"}><i className="bi-plus-lg"></i> Novo</button>
					</Link>
					<ServicesTable services={services} setServices={setServices}/>
				</div>
			</AuthRequired>
		</>
	)
}

export default Services
