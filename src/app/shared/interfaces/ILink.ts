
export interface ILink extends IClickableArea {

}


export interface IClickableArea {
	x1: number;
	x2: number;
	y1: number;
	y2: number;
	destinationFileId:string;
	// NOTE: destinationFileId property is the id of the file which will be linked to the current file through the selected area.
}

