import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IFile } from '../../../../shared/interfaces/IFile';

@Component({
	selector: 'app-file-list-item',
	templateUrl: './file-list-item.component.html'
})
export class FileListItemComponent implements OnInit {

	@Input() public file: IFile;

	@Output('onSave') public onSave: EventEmitter<IFile> = new EventEmitter<IFile>();
	@Output('onDelete') public onDelete: EventEmitter<IFile> = new EventEmitter<IFile>();
	@Output('onEdit') public onEdit: EventEmitter<IFile> = new EventEmitter<IFile>();

	constructor() { }

	ngOnInit() {

	}

	public onSaveClicked(file:IFile) {
		this.onSave.emit(file);
	}
	public onDeleteClicked(file:IFile) {
		this.onDelete.emit(file);
	}
	public onEditClicked(file:IFile) {
		console.log('onEditClicked', file.id);
		this.onEdit.emit(file);
	}
	

}
