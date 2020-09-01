import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { forkJoin } from 'rxjs';
import { FilesService } from '../../../../shared/data-services/files.service';
import { IProjectResolved } from '../../../../shared/interfaces/IProject';
import { FileResizeService } from "../../../../shared/services/file-resize.service";
import {map, switchMap, tap} from "rxjs/operators";


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
		private route: ActivatedRoute,
		private notifier: NotifierService,
		public fileCtrl: FilesService,
		public router: Router,
		public fileResize: FileResizeService
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
			if ( !this.isImage( fileList.item(i)) ) {
				this.notifier.notify('default', `'${fileList.item(i).name}' is not a image.`);
				continue;
			}
			// if (fileList.item(i).size>100000) {
			// 	this.notifier.notify('default', `'${fileList.item(i).name}' is too large.`);
			// 	continue;
			// }

			this.addFilePreview( fileList.item(i) );
		}
	}

	public submitUploadFilesForm(): void {
		if (this.uploadFilesForm.invalid) {
			this.uploadFilesForm.setErrors({message: 'Please fill in a display name for all the files.'});
			return;
		}
		const resolvedData: IProjectResolved = this.route.parent.snapshot.data['resolvedData'];
		const projectId: string = resolvedData.project.id;

		const filesToUpload = this.filePreviews.controls.map( file => this.fileCtrl.create({
			name: file.get('name').value,
			base64: file.get('base64').value
		}, projectId ));

		// TODO: replace notification with a loader to prevent user from interacting with the page
		this.notifier.notify('default', 'Please wait. Files are being uploaded...', 'NOTIF_PLEASE_WAIT');

		forkJoin(filesToUpload).subscribe(
			res => {
				this.notifier.hide('NOTIF_PLEASE_WAIT');
				this.notifier.notify('success', `Files uploaded successfully`);
				this.router.navigate(['../files-inspect'],{relativeTo: this.route});
			},
			err => {
				this.notifier.notify('error', `Something went wrong. ${err.message}`);
				console.log(err)
			}
		);
	}

	private addFilePreview(file: File): void {
		this.fileResize.readImgDimensions(file).pipe(
			switchMap(res => this.fileResize.resizeImage(res.base64, res.height, res.width)),
			tap(resizedImage => {
				this.filePreviews.push( this.buildFilePreview(resizedImage) );
			})
		).subscribe();
	}

	private buildFilePreview(base64:any): FormGroup {
		 return this.fb.group({
			name: ['', Validators.required],
			base64: base64,
		});
	}

	public removeFilePreview(index: number): void {
		this.filePreviews.removeAt(index);
	}

	private isImage(file: File): boolean {
		return RegExp('image/*').test(file.type);
	}

}
