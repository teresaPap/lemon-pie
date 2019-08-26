import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IFile } from '../../../shared/interfaces/IFile';

@Component({
	selector: 'app-file-list-item',
	templateUrl: './file-list-item.component.html'
})
export class FileListItemComponent implements OnInit {

	@Input() public file: IFile;

	@Output('onSave') public onSave: EventEmitter<any> = new EventEmitter<any>();
	@Output('onDelete') public onDelete: EventEmitter<any> = new EventEmitter<any>();
	@Output('onEdit') public onEdit: EventEmitter<any> = new EventEmitter<any>();

	constructor() { }

	ngOnInit() {

	}

}
