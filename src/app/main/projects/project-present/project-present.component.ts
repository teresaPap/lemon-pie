import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../shared/services/storage.service';
import { IFile } from '../../../shared/interfaces/IFile';
import { FilesService } from '../../../shared/data-services/files.service';

@Component({
	selector: 'app-project-present',
	templateUrl: './project-present.component.html',
})
export class ProjectPresentComponent implements OnInit {

	public file: IFile;
	public showLinks = false;

	constructor(
		public storage: StorageService,
		public filesCtrl: FilesService,
	) { }

	ngOnInit() {
		this.setActiveFile(this.storage.load('activeFile'));
	}


	public onLinkAreaClicked(destinationFileId: string) {
		if (!destinationFileId) {
			return;
		}
		const storedFiles = this.storage.load('storedFiles');
		const selectedFile = storedFiles.find( file => file.id === destinationFileId);
		this.setActiveFile(selectedFile);
	}

	public onToggleLinks(): void {
		this.showLinks = !this.showLinks;
	}

	private setActiveFile(file: IFile) {
		// TODO: This function exists in two components. Better to move it to an external service.
		this.file = file;

		this.storage.store('activeFile', file);

		this.filesCtrl.getFileLinks(this.file.id).subscribe(
			res => {
				this.storage.store('activeLinks', res)
			},
			error => {
				console.log('links error' , error)
				this.storage.store('activeLinks', [])
			}
		);
	}

}
