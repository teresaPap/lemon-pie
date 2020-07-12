import * as firebase from 'firebase/app';
import { IClickableArea } from './ILink';


export interface IFilePreview {
	name: string;
	base64: any;
}

export interface IFile extends IFilePreview {
	id: string; // NOTE: It is optional only because it is generated asynchronously.
	references?: Array<firebase.firestore.DocumentReference> | IClickableArea[];
}
