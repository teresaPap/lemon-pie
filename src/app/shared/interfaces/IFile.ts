import { DocumentReference } from '@angular/fire/firestore';
import { IClickableArea } from './ILink';


export interface IFilePreview {
	name: string;
	base64: any;
}

export interface IFile extends IFilePreview {
	id: string; // NOTE: It is optional only because it is generated asynchronously.
	references?: DocumentReference[] | IClickableArea[];
}
