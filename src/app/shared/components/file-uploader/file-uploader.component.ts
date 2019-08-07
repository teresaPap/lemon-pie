import { Component, OnInit, Input } from '@angular/core';

// COMPONENT DESCRIPTION: 
// FileUploaderComponent is used wherever the user needs to drag and drop files to be uploaded.
// it listens for files that are droped in dropzone directive
// for each file dropped in dropzone, it calls UploadTaskComponent to upload the file to some uploadPath.
// this uploadPath is given as an input to FileUploaderComponent from its parent component (for reusability reasons)
// (?) maybe in the future the file type to be uploaded can be given as an input as well (for consistency reasons)
// After a file upload is completed successfully, FileUploaderComponent is notified by UploadTaskComponent
// with a string image preview of the syccessfully uploaded file.
// User has the chance to delete a newly uploaded file by clicking a button on the preview
// For file delete, fileCtrl.delete(fileId) is called. 
// On delete end/success the deleted file's preview hides

// User has the chance to upload as many files as they want. 
// User clicks a dedicated button to exit/close the file uploader.

@Component({
	selector: 'app-file-uploader',
	templateUrl: './file-uploader.component.html',
	styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent implements OnInit {
	
	@Input() promptText:string;
	@Input() uploadPath:string;


	public isHovering: boolean;

	public files: File[] = [];

	constructor() { }

	ngOnInit(): void { }

	toggleHover(event: boolean) {
		this.isHovering = event;
	}

	onDrop(files: FileList) {
		for (let i = 0; i < files.length; i++) {
			this.files.push(files.item(i));
		}
	}
	
}