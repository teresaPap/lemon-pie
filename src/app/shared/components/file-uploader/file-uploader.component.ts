import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-file-uploader',
	templateUrl: './file-uploader.component.html',
	styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent implements OnInit {
	
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