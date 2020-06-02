import * as firebase from 'firebase';
import { IClickableArea } from './ILink';



export interface IFile extends IFilePreview {
	id: string; // NOTE: It is optional only because it is generated asynchronously.
	links?: Array<firebase.firestore.DocumentReference> | IClickableArea[] ;
}

export interface IFilePreview {
	name: string;
	base64: any;
}
