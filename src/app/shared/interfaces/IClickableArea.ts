export interface IClickableArea {
	startingPos: ICanvasPosition;
	finalPos: ICanvasPosition;
	link: string; // == fileId
}

export interface ICanvasPosition {
	x: number;
	y: number;
}