export interface IFile {
	downloadURL: string;
	path: string;

	name?: string;
	pageName?: string;

	id?: string;
	links?: IArea[];
}

export interface IArea {
	x1: number;
	x2: number;
	y1: number;
	y2: number;
}