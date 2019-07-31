import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IProject } from '../../interfaces/IProject';
import { ProjectsService } from '../../data-services/projects.service';


@Component({
	selector: 'app-add-project',
	templateUrl: './add-project.component.html',
	styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {

	public addProjectForm: FormGroup;

	constructor( 
		private fb: FormBuilder,
		private projectCtlr: ProjectsService ) { 
	}

	ngOnInit() {
		this.addProjectForm = this.fb.group({
			name: ['', Validators.required],
			description: ['']
		})
	}

	public onSubmit(): void {
		this.createProject(this.addProjectForm.value);
	}

	private createProject( project: IProject ) {
		this.projectCtlr.create(project).subscribe(
			res => console.log('\nCreated a new project with id: '+ res )
		);
	}

}
