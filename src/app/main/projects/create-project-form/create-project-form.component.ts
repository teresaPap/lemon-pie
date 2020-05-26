import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ProjectsService } from '../../../shared/data-services/projects.service';
import { StorageService } from '../../../shared/services/storage.service';
import { IProject } from '../../../shared/interfaces/IProject';



@Component({
  selector: 'app-create-project-form',
  templateUrl: './create-project-form.component.html',
})
export class CreateProjectFormComponent implements OnInit {

	public projectCreateForm: FormGroup;

	constructor(
		public router: Router,
		public storage: StorageService,
		private projectCtrl: ProjectsService,
		private fb: FormBuilder,
		private notifier: NotifierService
	) { }

  ngOnInit(): void {

	  this.projectCreateForm = this.fb.group({
		  name: ['', Validators.required],
		  description: ''
	  });

  }


	public saveProjectCreateForm() {
		if (!this.projectCreateForm.valid) {
			// Handle error messages
			return;
		}

		this.projectCtrl.create(this.projectCreateForm.value).subscribe(
			(project: IProject) => {
				this.notifier.notify('success', `Project was created successfully`);

				this.setActiveProject(project);
				this.router.navigate([`projects/${project.id}`]);
			}
		)
	}

	private setActiveProject(project) {
		this.storage.store('activeProject', {
			name: project.name,
			id: project.id
		});
	}


}
