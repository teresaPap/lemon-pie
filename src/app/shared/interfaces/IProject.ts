import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { IFile } from './IFile';

export interface IProject {
	name: string;
	description: string;
	references?: Array<firebase.firestore.DocumentReference> | IFile[] ;
	id?: string;
}

export interface IProjectPreview extends IProject {
	previewSource?: Observable<any>;
	previewImage: string;
}

export interface IProjectResolved {
	project: IProject;
	files: IFile[];
	error?: any;
}

export interface IProjectListResolved {
	projects: IProjectPreview[];
	error?: any;
}
