import { DocumentReference } from '@angular/fire/firestore';

export interface IUser extends IPersonalData {
	id: string;
	references?: DocumentReference[];
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
