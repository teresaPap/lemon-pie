import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FilesService } from '../../data-services/files.service';

// COMPONENT DESCRIPTION: 
// UploadTaskComponent takes as an Input a file and  
// a db path where this file should be stored.
// Then, it calls fileCtrl.upload() to do the actual file upload
// When the upload is completed (observable on subscribe): 
// - parent component should (?) be notified
// - a small preview of the uploaded file should (?) be shown 
// - πρέπει να ειδοποιήσω τον parent component με ενα string που περιέχει το file preview.


@Component({
	selector: 'app-upload-task',
	templateUrl: './upload-task.component.html'
})
export class UploadTaskComponent implements OnInit, OnDestroy {

	@Input() file: File;
	@Input() uploadPath: string;
	@Output('onStartUpload') public onStartUpload: EventEmitter<any> = new EventEmitter<any>();

	private uploadingNewFile: Subscription = new Subscription;

	percentage: Observable<number>;
	snapshot: Observable<any>;
	downloadURL: string;

	constructor(
		private fileCtrl: FilesService ) {
	}

	ngOnInit() {
		if (this.file) {
			this.startUpload();
		}
	}

	ngOnDestroy() {
		this.uploadingNewFile.unsubscribe();
		console.log('UploadTaskComponent ON DESTROY');
	}

	public isActive(snapshot) {
		// TODO: What's this?
		return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
	}

	private startUpload(): void {
		this.onStartUpload.emit();
		
		this.uploadingNewFile = this.fileCtrl.create( this.file, this.uploadPath ).subscribe(
			res => console.log('FILE CREATE SUCCESS: ', res), 
			err => console.log('FILE CREATE FAILED: ', err),
			() => console.log('FILE CREATE COMPLETED')
		);
	}

}