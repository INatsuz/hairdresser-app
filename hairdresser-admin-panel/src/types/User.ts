export default interface User {
	ID: number;
	username: string;
	name: string;
	userType: UserType;
	notificationToken: string
}

export enum UserType {
	ADMIN = "ADMIN",
	HAIRDRESSER = "HAIRDRESSER"
}