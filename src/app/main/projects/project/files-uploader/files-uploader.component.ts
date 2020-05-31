import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormArray, Validators} from '@angular/forms';
import { IFile, IFilePreview } from '../../../../shared/interfaces/IFile';

@Component({
  selector: 'app-files-uploader',
  templateUrl: './files-uploader.component.html',
})
export class FilesUploaderComponent implements OnInit {

	public uploadFilesForm: FormGroup;
	public isHovering: boolean;

	public get filePreviews(): FormArray {
		return this.uploadFilesForm.get('filePreviews') as FormArray;
	}

	constructor(
		private fb: FormBuilder,
	) { }

  	ngOnInit(): void {
		this.uploadFilesForm = this.fb.group({
			filePreviews: this.fb.array([]),
		});
  	}

	public toggleHover(isHovering: boolean): void {
		this.isHovering = isHovering;
	}

	public onDrop(fileList: FileList): void {
		for (let i = 0 ; i < fileList.length ; i++ ) {
			if ( !this.isImage( fileList.item(i)) ) continue;
			this.addFilePreview( fileList.item(i) );
		}
	}

	public submitUploadFilesForm(): void {
		if (this.uploadFilesForm.invalid) {
			this.uploadFilesForm.setErrors({message: 'Please fill in a display name for all the files.'});
			return;
		}
		console.log(this.uploadFilesForm.value, 'uploadFilesForm is valid: ' + this.uploadFilesForm.valid);
	}

	private addFilePreview(file: File): void {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = (_event) =>
			this.filePreviews.push( this.buildFilePreview(reader.result, file) );
	}

	private buildFilePreview(base64:any, file: File): FormGroup {
		 return this.fb.group({
			displayName: ['', Validators.required],
			base64: base64,
			file: file
		});
	}

	public removeFilePreview(index: number): void {
		this.filePreviews.removeAt(index);
	}

	private isImage(file: File): boolean {
		return RegExp('image/*').test(file.type);
	}
}
