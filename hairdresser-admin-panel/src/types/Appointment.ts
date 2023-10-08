export default interface Appointment {
	ID: number;
	serviceID: number;
	serviceName: string;
	clientID: number;
	clientName: string;
	assignedUser: number | null;
	assignedUserName: string | null;
	price: number;
	timeStart: Date;
	timeEnd: Date;
}