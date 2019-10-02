export interface IClickableArea {
	startingPos: ICanvasPosition;
	finalPos: ICanvasPosition;
	linkedFileId: string; // NOTE: this property is the id of the file witch will be linked to the current file through the selected area. 
}

export interface ICanvasPosition {
	x: number;
	y: number;
}