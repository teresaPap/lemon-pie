import { Component, OnInit, Input, ChangeDetectorRef, OnChanges } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Component({
	selector: 'app-upload-task',
	templateUrl: './upload-task.component.html',
	styleUrls: ['./upload-task.component.scss']
})
export class UploadTaskComponent implements OnInit {


	@Input() file: File;
	@Input() uploadPath: string;

	public task: AngularFireUploadTask;

	percentage: Observable<number>;
	snapshot: Observable<any>;
	downloadURL: string;

	constructor(
		private storage: AngularFireStorage, 
		private db: AngularFirestore ) {
	}

	ngOnInit() {
		console.log('hello UploadTaskComponent! ' );
		if (this.file) this.startUpload();
	}


	startUpload() {

		// The storage path
		// TODO: set the db path you want to use as the pic storage. Best practice is to design from now the db schema ypu will folllow
		// const path = `lemonpie-f5dba.firebaseio.com/test/${Date.now()}_${this.file.name}`;

		// Reference to storage bucket
		const ref = this.storage.ref(this.uploadPath);

		// The main task
		this.task = this.storage.upload(this.uploadPath, this.file);

		// Progress monitoring
		this.percentage = this.task.percentageChanges();

		this.snapshot = this.task.snapshotChanges().pipe(
			tap(console.log),
			// The file's download URL
			finalize( async () => {
				this.downloadURL = await ref.getDownloadURL().toPromise();
				let uploadPath = this.uploadPath;
				this.db.collection('files').add({ downloadURL: this.downloadURL, uploadPath });
			}),
		);
	}

	isActive(snapshot) {
		return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
	}

}