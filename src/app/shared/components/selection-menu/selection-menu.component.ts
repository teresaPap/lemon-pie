import { Component, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IFile } from '../../interfaces/IFile';

@Component({
	selector: 'app-selection-menu',
	templateUrl: './selection-menu.component.html'
})
export class SelectionMenuComponent {

	@Input('files') files: IFile[];
	@Input('activeFileId') activeFileId: string;
	@Output() onSubmit: EventEmitter<string> = new EventEmitter<string>();
	@Output() onClose: EventEmitter<void> = new EventEmitter<void>();

	public linkToFileForm: FormGroup;

	constructor( private fb: FormBuilder ) {
		this.linkToFileForm = this.fb.group({
			fileId: ['', Validators.required]
		});
	}

	public submitLinkToFileForm(): void {
		if (this.linkToFileForm.valid) {
			this.onSubmit.emit(this.linkToFileForm.controls['fileId'].value);
		}
	}

	public close(): void {
		this.onClose.emit();
	}

}
