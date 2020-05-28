import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ProjectsService } from '../../../../shared/data-services/projects.service';
import { IProjectResolved } from '../../../../shared/interfaces/IProject';


@Component({
  selector: 'app-project-details-form',
  templateUrl: './project-details-form.component.html'
})
export class ProjectDetailsFormComponent implements OnInit {

	public projectDetailForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private projectCtrl: ProjectsService,
		private notifier: NotifierService,
		public router: Router,
	) { }

	ngOnInit(): void {
		const resolvedData: IProjectResolved = this.route.parent.snapshot.data['resolvedData'];

		this.projectDetailForm = this.fb.group({
			name: [resolvedData.project.name, Validators.required],
			description: [resolvedData.project.description]
		});
	}

	public submitProjectDetailForm(): void {
		if (this.projectDetailForm.invalid) {
			this.projectDetailForm.setErrors({message: 'Project name is required.'});
			return;
		}
		const resolvedData: IProjectResolved = this.route.parent.snapshot.data['resolvedData'];
		const projectId = resolvedData.project.id;


		this.projectCtrl.update(projectId, {
			name: this.projectDetailForm.controls['name'].value,
			description:  this.projectDetailForm.controls['description'].value,
		}).subscribe(
			res => this.notifier.notify('success', `Project details updated successfully`),
			err => this.notifier.notify('error', `Project details update failed`)
		);
	}
}
