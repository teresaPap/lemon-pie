// This is a temporary interface collection containing interfaces returned by firebase db
// TODO: separate properly the following interfaces according to what the project needs


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

export interface IUserData extends IUser {
	username?: string;
	role?: string;

	// Generated data
	projects?: Array<firebase.firestore.DocumentReference>;
}
