import * as firebase from "firebase";

export interface IUser {
	id: string;
	email: string;
	username?: string;
	role?: string;

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

export interface ILoginData {
	email: string;
	password: string;
}
