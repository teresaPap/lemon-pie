import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NotifierService } from 'angular-notifier';
import { FilesService } from '../../../../shared/data-services/files.service';
import { IFile } from '../../../../shared/interfaces/IFile';


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
		private notifier: NotifierService,
		public filesCtrl: FilesService
	) { }

	ngOnInit(): void {
		this.fileItemForm = this.fb.group({
			displayName: [ this.file.displayName, Validators.required]
		});
	}

	public onDeleteClicked(file: IFile) {
		this.onDelete.emit(file);
	}

	public saveFileItemForm() {
		this.filesCtrl.update(this.file.id, this.fileItemForm.value).subscribe(
			res => {
				console.log(res);
				this.notifier.notify('success', 'File has been renamed');
			},
			error => {
				console.log(error);
				this.notifier.notify('error', 'Something went wrong');
			}
		);
	}
}
