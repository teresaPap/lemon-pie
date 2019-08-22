import { Observable } from 'rxjs';
import { IFile } from './IFile';

export interface IProject {
	name: string;
	description: string;
	files?: Array<firebase.firestore.DocumentReference> | IFile[] ;

	// added afterwards
	preview?: Observable<firebase.firestore.DocumentData>;
	previewSrc?: string;
	id?: string;
}