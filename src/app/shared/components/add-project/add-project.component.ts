import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
	selector: 'app-add-project',
	templateUrl: './add-project.component.html',
	styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {

	@Output() name: EventEmitter<any> = new EventEmitter();

	public addProjectForm: FormGroup;

	constructor( private fb: FormBuilder ) { 
		this.addProjectForm = this.fb.group({
			name: ['', Validators.required],
			files: [] 
		})
	}

	ngOnInit() {
	}

	public onSubmit(): void {
		console.log(this.addProjectForm.value);
	}

}
