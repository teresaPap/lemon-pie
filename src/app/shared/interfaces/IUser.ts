import * as firebase from "firebase";

export interface IUser extends IPersonalData {
	id: string;
	references?: Array<firebase.firestore.DocumentReference>;
}

export interface IPersonalData {
	email: string;
	username: string;
	role?: string;
}

export interface IAuthData {
	email: string;
	password: string;
	displayName?: string;
}
