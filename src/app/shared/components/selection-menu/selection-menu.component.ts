import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
	selector: 'app-selection-menu',
	templateUrl: './selection-menu.component.html'
})
export class SelectionMenuComponent implements OnInit {

	public linkToFileForm: FormGroup;

	constructor( private fb: FormBuilder ) { 
		this.linkToFileForm = this.fb.group({
			fileName: ''
		})
	}

	ngOnInit() {
	}

	public submitLinkToFileForm() {
		console.log(this.linkToFileForm.value);
	}

}
