import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { IFile } from '../../interfaces/IFile';

@Component({
	selector: 'app-aside',
	templateUrl: './aside.component.html'
})
export class AsideComponent implements OnInit {
	@Input() mode?: 'preview'|'edit' = 'edit';

	@Output('onToggleLinks') onToggleLinks: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output('onSaveAllChanges') onSaveAllChanges: EventEmitter<void> = new EventEmitter<void>();
	@Output('onChangeActiveFile') onChangeActiveFile: EventEmitter<IFile> = new EventEmitter<IFile>();

	public files: IFile[];
	public previewModeOn: boolean;

	constructor(
		public storage: StorageService,
		private location: Location
	) {
		this.files = storage.load('storedFiles');
	}

	ngOnInit(): void {
		this.previewModeOn = (this.mode === 'preview');
	}

	public toggleLinks(): void {
		this.onToggleLinks.emit();
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

