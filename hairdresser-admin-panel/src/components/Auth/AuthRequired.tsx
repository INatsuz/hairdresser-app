import React, {ReactNode} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import {Navigate} from "react-router-dom";

type AuthRequiredProps = {
	children: ReactNode
}

const AuthRequired: React.FC<AuthRequiredProps> = ({children}) => {
	const loggedIn: boolean | null = useSelector((state: RootState) => state.session.loggedIn);

	return (
		<>
			{
				loggedIn === false ?
				<Navigate to={"/"}/>
				:
				children
			}
		</>
	)
}

export default AuthRequired;