import * as firebase from 'firebase';
import { IClickableArea } from './ILink';



export interface IFile {
	downloadURL: string;
	path: string;

	name?: string;
	// NOTE: name is optional only because it is generated asyncronusly.

	id?: string; // NOTE: It is optional only because it is generated asyncronusly.
	links?: Array<firebase.firestore.DocumentReference> | IClickableArea[] ;
}


