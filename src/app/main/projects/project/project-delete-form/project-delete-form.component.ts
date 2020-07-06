import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ProjectsService } from '../../../../shared/data-services/projects.service';
import { IProjectResolved } from '../../../../shared/interfaces/IProject';


@Component({
  selector: 'app-project-delete-form',
  templateUrl: './project-delete-form.component.html',
})
export class ProjectDeleteFormComponent implements OnInit {

	public deleteProjectForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private projectCtrl: ProjectsService,
		private notifier: NotifierService,
		public router: Router,
	) { }

  	ngOnInit(): void {
		this.deleteProjectForm = this.fb.group({
			confirmDelete: ['', [Validators.required, Validators.pattern('I want to delete this project')]]
		});
  	}

	public submitDeleteProjectForm(): void {
		if (this.deleteProjectForm.invalid) {
			this.deleteProjectForm.setErrors({message: 'Please fill in the security quote.'});
			return;
		}
		const resolvedData: IProjectResolved = this.route.parent.snapshot.data['resolvedData'];
		const projectId: string = resolvedData.project.id;

		this.projectCtrl.delete(projectId).subscribe( res => {
			this.notifier.notify('success', `Project was deleted successfully`);
			this.router.navigate(['/projects']);
		});
	}

}
