import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { IFile } from './IFile';

export interface IProject {
	name: string;
	description: string;
	references?: Array<firebase.firestore.DocumentReference> | IFile[] ;
	id?: string;
}

export interface IProjectPreview extends IProject {
	// added afterwards
	preview?: Observable<firebase.firestore.DocumentData>;
	previewSrc?: string;
}

export interface IProjectResolved {
	project: IProject;
	error?: any;
}

export interface IProjectListResolved {
	projects: IProject[];
	error?: any;
}
