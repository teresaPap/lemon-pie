import { Component, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IFile } from '../../../../shared/interfaces/IFile';
import { StorageService } from '../../../../shared/services/storage.service';

@Component({
	selector: 'app-selection-menu',
	templateUrl: './selection-menu.component.html'
})
export class SelectionMenuComponent implements OnInit {

	@Output() onSaveLink: EventEmitter<string> = new EventEmitter<string>();
	@Output() onClose: EventEmitter<void> = new EventEmitter<void>();

	public files: IFile[];
	public linkToFileForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		public storage: StorageService ) {

		this.linkToFileForm = this.fb.group({
			fileId: ['', Validators.required]
		});
	}

	ngOnInit() {
		this.files = this.storage.load('storedFiles');
	}

	public submitLinkToFileForm() {
		if (this.linkToFileForm.valid) {
			this.onSaveLink.emit(this.linkToFileForm.controls['fileId'].value);
		}
	}

	public close() {
		this.onClose.emit();
	}

}
