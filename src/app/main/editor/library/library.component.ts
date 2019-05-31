import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../../../shared/services/file-upload.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'app-library',
	templateUrl: './library.component.html',
	styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {

	public fileToUpload: File = null;
	public imgPreview;

	constructor( 
		private fileUploader: FileUploadService,
		private domSanitizer: DomSanitizer ) { }

	ngOnInit() {
	}

	handleFileInput(files: FileList) {
        if (files.length > 0) {
            let file: File = files[0];
            if (this.validImage(file)) {

				console.log(file);
				let fileUrl = window.URL.createObjectURL(file);
				this.imgPreview = this.domSanitizer.bypassSecurityTrustResourceUrl(fileUrl);
				
            } else {
				console.warn('not a valid image');
				// this.uploadFile.nativeElement.value = '';
            }
        }
	}


	uploadFile() {
		this.fileUploader.postFile(this.fileToUpload).subscribe(
			d => {
				// do something, if upload success
			}, 
			e => console.error('Upload File Error: ' , e ));
	}

	// readURL(files: FileList) {
    //     if (files && files[0]) {
    //         var reader = new FileReader();

	// 		reader.onload
			
	// 		{  e => 
    //             document.getElementById('blah').src = e.target.result
    //         };

    //         reader.readAsDataURL(input.files[0]);
    //     }
    // }

	private validImage(file: File): boolean {
		// TODO: add other validations (eg file size) if needed

		console.log( '57', file.type.indexOf('image') );
        if ( file.type.indexOf('image') > -1)  return true;
        return false;
    }


}
