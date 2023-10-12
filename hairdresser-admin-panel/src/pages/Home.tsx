import React from 'react'
import Navbar from "../components/Navbar/Navbar.tsx";
import {Navigate} from "react-router-dom";

const Home: React.FC = () => {

	return (
		<>
			<Navbar/>
			<Navigate to={"/appointments"}/>
		</>
	)
}

export default Home
