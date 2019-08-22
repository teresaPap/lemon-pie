import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IFile } from '../../interfaces/IFile';
import { StorageService } from '../../services/storage.service';

@Component({
	selector: 'app-selection-menu',
	templateUrl: './selection-menu.component.html'
})
export class SelectionMenuComponent implements OnInit {

	@Output() saveLink: EventEmitter<string> = new EventEmitter<string>();

	public files: IFile[];
	public linkToFileForm: FormGroup;

	constructor( 
		private fb: FormBuilder, 
		public storage: StorageService ) {

		this.linkToFileForm = this.fb.group({
			fileId: ''
		})
	}

	ngOnInit() {
		const activeProject = this.storage.load('activeProject');
		this.files = activeProject.files;
	}

	public submitLinkToFileForm() {
		this.saveLink.emit(this.linkToFileForm.controls['fileId'].value);
	}

}
