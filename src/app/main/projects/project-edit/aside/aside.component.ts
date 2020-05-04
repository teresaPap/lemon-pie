import { Component, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { StorageService } from '../../../../shared/services/storage.service';
import { IFile } from '../../../../shared/interfaces/IFile';
import { IProject } from '../../../../shared/interfaces/IProject';

@Component({
	selector: 'app-aside',
	templateUrl: './aside.component.html'
})
export class AsideComponent {
	@Output('onShowLinks') onShowLinks: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output('onSaveAllChanges') onSaveAllChanges: EventEmitter<void> = new EventEmitter<void>();
	@Output('onChangeActiveFile') onChangeActiveFile: EventEmitter<IFile> = new EventEmitter<IFile>();

	public activeProject: IProject;
	public files: IFile[];

	constructor(
		public storage: StorageService,
		private location: Location
	) {
		this.activeProject = storage.load('activeProject');
		// @ts-ignore
		this.files = this.activeProject.files;
	}

	public showLinks(event): void {
		this.onShowLinks.emit(event);
	}

	public navigateBack(): void {
		this.location.back();
	}

	public saveAllChanges(): void {
		this.onSaveAllChanges.emit();
	}

	public selectFile(file: IFile): void {
		this.onChangeActiveFile.emit(file);
	}

}

