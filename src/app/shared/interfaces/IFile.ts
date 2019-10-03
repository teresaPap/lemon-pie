export interface IFile {
	downloadURL: string;
	path: string;

	name?: string; // NOTE: It is optional only because it is generated asyncronusly. TODO: Make it required and fix any issues occured. 

	id?: string; // NOTE: It is optional only because it is generated asyncronusly.
	links?: IClickableArea[];
}

export interface IClickableArea {
	x1: number;
	x2: number;
	y1: number;
	y2: number;
	linkedFileId: string; // NOTE: this property is the id of the file witch will be linked to the current file through the selected area. 
}

// export interface IClickableArea {
// 	startingPos: ICanvasPosition;
// 	finalPos: ICanvasPosition;
// 	linkedFileId: string; // NOTE: this property is the id of the file witch will be linked to the current file through the selected area. 
// }

