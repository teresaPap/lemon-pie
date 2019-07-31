export interface IProject {
	name: string;
	description: string;
	files?: Array<firebase.firestore.DocumentReference>;
}