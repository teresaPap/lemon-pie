import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ProjectsService } from '../../../../shared/data-services/projects.service';
import { IProject } from '../../../../shared/interfaces/IProject';


@Component({
  selector: 'app-project-details-form',
  templateUrl: './project-details-form.component.html'
})
export class ProjectDetailsFormComponent implements OnInit {

	private activeProjectId: string;
	public projectDetailForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		public projectCtrl: ProjectsService,
		private notifier: NotifierService,
		public router: Router,
	) { }

	ngOnInit(): void {
		this.projectDetailForm = this.fb.group({
			name: ['', Validators.required],
			description: ''
		});

		this.projectCtrl.activeProjectChanges$.subscribe( (activeProject: IProject) => {
			this.projectDetailForm.controls['name'].setValue(activeProject.name);
			this.projectDetailForm.controls['description'].setValue(activeProject.description);
			this.activeProjectId = activeProject.id;
		});

	}

	public submitProjectDetailForm(): void {
		if (this.projectDetailForm.invalid) {
			this.projectDetailForm.setErrors({message: 'Project name is required.'});
			return;
		}

		this.projectCtrl.update(this.activeProjectId, {
			name: this.projectDetailForm.controls['name'].value,
			description: this.projectDetailForm.controls['description'].value,
		}).subscribe(
			res => this.notifier.notify('success', `Project details updated successfully`),
			err => {
				console.error(err);
				this.notifier.notify('error', `Project details update failed`);
			}
		);
	}
}
