import * as firebase from "firebase";

export interface IUser extends IPersonalData {
	id: string;

	// Generated data
	references?: Array<firebase.firestore.DocumentReference>;

	// To be added later on - maybe
	refreshToken: string;
	displayName?: string;
	emailVerified: boolean;
	isAnonymous: boolean;
	phoneNumber?: string;
	photoURL?: string;
}

export interface IPersonalData {
	email: string;
	username: string;
	role?: string;
}

export interface IAuthData {
	email: string;
	password: string;
}
