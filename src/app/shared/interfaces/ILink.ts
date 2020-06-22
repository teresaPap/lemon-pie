
export interface ICanvasSelection {
	x1: number;
	x2: number;
	y1: number;
	y2: number;
}

export interface IClickableArea extends ICanvasSelection {
	destinationFileId:string;
	// NOTE: destinationFileId property is the id of the file which will be linked to the current file through the selected area.
}

export interface ILink extends IClickableArea {
	id?: string;
}
