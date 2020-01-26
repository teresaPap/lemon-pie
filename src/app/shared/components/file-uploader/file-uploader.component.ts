import { Component, Output, EventEmitter } from '@angular/core';

// COMPONENT DESCRIPTION:
// FileUploaderComponent is used wherever the user needs to drag and drop files to be uploaded.
// it listens for files that are droped in dropzone directive
// User can to upload as many files as they want.


@Component({
	selector: 'app-file-uploader',
	templateUrl: './file-uploader.component.html'
})
export class FileUploaderComponent {

	@Output('onFilesDrop') onFilesDrop: EventEmitter<FileList> = new EventEmitter<FileList>();
	public isHovering: boolean;

	constructor() { }

	public toggleHover(isHovering: boolean): void {
		this.isHovering = isHovering;
	}

	public onDrop(fileList: FileList): void {
		this.onFilesDrop.emit(fileList);
	}

}
