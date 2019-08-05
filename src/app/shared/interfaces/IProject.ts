export interface IProject {
	name: string;
	description: string;
	files?: Array<firebase.firestore.DocumentReference>;
	preview?: any; // url to image source
	previewSrc?: string;
}