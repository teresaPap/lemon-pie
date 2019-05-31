import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../../../shared/services/file-upload.service';

@Component({
	selector: 'app-library',
	templateUrl: './library.component.html',
	styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {

	public fileToUpload: File = null;

	constructor( private fileUploader: FileUploadService ) { }

	ngOnInit() {
	}

	handleFileInput(files: FileList) {
		this.fileToUpload = files.item(0);
		console.log( 'file to upload: ', this.fileToUpload );
	}

	uploadFile() {
		this.fileUploader.postFile(this.fileToUpload).subscribe(
			d => {
				// do something, if upload success
			}, 
			e => console.error('Upload File Error: ' , e ));
	  }

}
