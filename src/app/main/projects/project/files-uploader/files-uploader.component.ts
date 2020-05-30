import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IFile } from '../../../../shared/interfaces/IFile';

@Component({
  selector: 'app-files-uploader',
  templateUrl: './files-uploader.component.html',
})
export class FilesUploaderComponent implements OnInit {

	public uploadFilesForm: FormGroup;
	public isHovering: boolean;

	public files: File[]|any = [1,2,3];


	constructor(
		private fb: FormBuilder,
	) { }

  	ngOnInit(): void {
		this.uploadFilesForm = this.fb.group({
			confirmDelete: ['', Validators.required ] // Validators.pattern('I want to delete this project')
		});
  	}


	public submitUploadFilesForm(): void {

	}

	public toggleHover(isHovering: boolean): void {
		this.isHovering = isHovering;
	}

	public onDrop(fileList: FileList): void {
		console.log('files dropped');
	}
}
