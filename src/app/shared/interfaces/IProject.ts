import { Observable } from 'rxjs';

export interface IProject {
	name: string;
	description: string;
	files?: Array<firebase.firestore.DocumentReference>;

	// added afterwards
	preview?: Observable<firebase.firestore.DocumentData>;
	previewSrc?: string;
	id?: string;
}