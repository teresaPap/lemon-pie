import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { FilesService } from '../../data-services/files.service';

// COMPONENT DESCRIPTION: 
// UploadTaskComponent takes as an Input a file and  
// a db path where this file should be stored.
// Then, it calls fileCtrl.upload() to do the actual file upload
// When the upload is completed (observable on subscribe): 
// - parent component should (?) be notified
// - a small preview of the uploaded file should (?) be shown 
// - πρέπει να ειδοποιήσω τον parent component με ενα string που περιέχει το file preview.


// TODO: delete all of the above description. 
// καλύτερα να παιρει σαν input μονο το snapshot changes και να το κανει display. 
// Μόλις 100% να καταστρέφεται - με κάποιον τρόπο. 

@Component({
	selector: 'app-upload-task',
	templateUrl: './upload-task.component.html'
})
export class UploadTaskComponent implements OnInit {

	@Input() file: File;
	@Input() uploadPath: string;
	@Output('onStartUpload') public onStartUpload: EventEmitter<File> = new EventEmitter<File>();

	percentage: Observable<number>;
	snapshot: Observable<any>;
	downloadURL: string;

	constructor(
		private fileCtrl: FilesService ) {
	}

	ngOnInit() {
		console.log(this.file)
		if (this.file) {
			this.onStartUpload.emit(this.file);
		}
	}

	public isActive(snapshot) {
		// TODO: What's this?
		return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
	}


}