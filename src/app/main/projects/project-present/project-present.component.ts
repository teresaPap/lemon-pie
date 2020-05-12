import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../shared/services/storage.service';
import { IFile } from '../../../shared/interfaces/IFile';

@Component({
	selector: 'app-project-present',
	templateUrl: './project-present.component.html',
})
export class ProjectPresentComponent implements OnInit {

	public file: IFile;
	public showLinks = false;

	constructor(
		public storage: StorageService,
	) { }

	ngOnInit() {
		this.setActiveFile(this.storage.load('activeFile'));
	}

	public onToggleLinks(): void {
		this.showLinks = !this.showLinks;
	}

	private setActiveFile(file: IFile) {
		this.file = file;
	}

}
