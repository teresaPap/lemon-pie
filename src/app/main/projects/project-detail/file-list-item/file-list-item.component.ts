import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IFile } from '../../../../shared/interfaces/IFile';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotifierService} from 'angular-notifier';

@Component({
	selector: 'app-file-list-item',
	templateUrl: './file-list-item.component.html'
})
export class FileListItemComponent implements OnInit {

	public fileItemForm: FormGroup;

	@Input() public file: IFile;

	@Output('onDelete') public onDelete: EventEmitter<IFile> = new EventEmitter<IFile>();
	@Output('onEdit') public onEdit: EventEmitter<IFile> = new EventEmitter<IFile>();

	constructor(
		private fb: FormBuilder,
		private notifier: NotifierService
	) { }

	ngOnInit(): void {
		this.fileItemForm = this.fb.group({
			name: ['', Validators.required]
		});
	}

	public onDeleteClicked(file: IFile) {
		this.onDelete.emit(file);
	}
	public onEditClicked(file: IFile) {
		console.log('onEditClicked', file.id);
		this.onEdit.emit(file);
	}

	public savefileItemForm() {
		console.log('TODO: add firebase call to update file name');
		this.notifier.notify('success', 'File has been renamed');
	}
}
