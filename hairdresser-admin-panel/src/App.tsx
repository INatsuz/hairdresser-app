import React, {useEffect} from 'react'
import './App.css'
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import Home from "./pages/Home.tsx";
import Appointments from "./pages/Appointment/Appointments.tsx";
import Clients from "./pages/Client/Clients.tsx";
import Services from "./pages/Service/Services.tsx";
import Users from "./pages/User/Users.tsx";
import Login from "./pages/Login.tsx";
import useLogin from "./hooks/useLogin.ts";
import CreateAppointment from "./pages/Appointment/CreateAppointment.tsx";
import CreateClient from "./pages/Client/CreateClient.tsx";
import CreateService from "./pages/Service/CreateService.tsx";
import CreateUser from "./pages/User/CreateUser.tsx";
import EditClient from "./pages/Client/EditClient.tsx";
import EditService from "./pages/Service/EditService.tsx";
import EditAppointment from "./pages/Appointment/EditAppointment.tsx";

const App: React.FC = () => {
	const [, checkLogin] = useLogin();

	useEffect(() => {
		checkLogin();
	}, [checkLogin])

	const router = createBrowserRouter([
		{
			path: "/",
			element: <Home/>
		}, {
			path: "/appointments",
			children: [
				{
					path: "",
					element: <Appointments/>
				}, {
					path: "create",
					element: <CreateAppointment/>
				}, {
					path: "edit",
					element: <EditAppointment/>
				}
			]
		}, {
			path: "/clients",
			children: [
				{
					path: "",
					element: <Clients/>
				}, {
					path: "create",
					element: <CreateClient/>
				}, {
					path: "edit",
					element: <EditClient/>
				}
			]
		}, {
			path: "/services",
			children: [
				{
					path: "",
					element: <Services/>
				}, {
					path: "create",
					element: <CreateService/>
				}, {
					path: "edit",
					element: <EditService/>
				}
			]
		}, {
			path: "/users",
			children: [
				{
					path: "",
					element: <Users/>
				}, {
					path: "create",
					element: <CreateUser/>
				}
			]
		}, {
			path: "/login",
			element: <Login/>
		}
	]);

	return (
		<>
			<RouterProvider router={router}/>
		</>
	)
}

export default App
