import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IFile } from '../../interfaces/IFile';
import { StorageService } from '../../services/storage.service';

@Component({
	selector: 'app-selection-menu',
	templateUrl: './selection-menu.component.html'
})
export class SelectionMenuComponent implements OnInit {

	public files: IFile[];
	public linkToFileForm: FormGroup;

	constructor( 
		private fb: FormBuilder, 
		public storage: StorageService ) {

		this.linkToFileForm = this.fb.group({
			fileName: ''
		})
	}

	ngOnInit() {
		const activeProject = this.storage.load('activeProject');
		this.files = this.storage.load(activeProject.id);
	}

	public submitLinkToFileForm() {
		console.log(this.linkToFileForm.value);
	}

}
