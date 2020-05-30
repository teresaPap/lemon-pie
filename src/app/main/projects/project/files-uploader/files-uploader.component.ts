import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IFile, IFilePreview } from '../../../../shared/interfaces/IFile';

@Component({
  selector: 'app-files-uploader',
  templateUrl: './files-uploader.component.html',
})
export class FilesUploaderComponent implements OnInit {

	private filesToUpload: File[] = [];
	public filesToPreview: IFilePreview[] = [];

	public uploadFilesForm: FormGroup;
	public isHovering: boolean;

	constructor(
		private fb: FormBuilder,
	) { }

  	ngOnInit(): void {
		this.uploadFilesForm = this.fb.group({
			displayName: null
		});
  	}

	public toggleHover(isHovering: boolean): void {
		this.isHovering = isHovering;
	}

	public submitUploadFilesForm(): void {

	}

	public onDrop(fileList: FileList): void {
		console.log('files dropped', fileList);

		for (let i = 0 ; i < fileList.length ; i++ ) {
			console.log(this.isImage(fileList.item(i)));

			if ( !this.isImage( fileList.item(i)) ) continue;

			this.createFilePreview( fileList.item(i) );

			// push into filesToUpload array
		}
	}

	private createFilePreview(file: File): void {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = (_event) => {
			this.filesToPreview.push({base64: reader.result});
		}
	}

	private isImage(file: File): boolean {
		return RegExp('image/*').test(file.type);
	}
}
