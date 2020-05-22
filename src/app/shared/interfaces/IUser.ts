// This is a temporary interface collection containing interfaces returned by firebase db
// TODO: separate properly the following interfaces according to what the project needs


import * as firebase from "firebase";

export interface IUser {
	uid: string;
	email: string;

	// To be added later on - maybe
	refreshToken: string;
	displayName?: string;
	emailVerified: boolean;
	isAnonymous: boolean;
	phoneNumber?: string;
	photoURL?: string;
}

export interface IUserData {
	email: string;
	role?: string;
	username?: string;

	// Generated data
	references?: Array<firebase.firestore.DocumentReference>;
}
