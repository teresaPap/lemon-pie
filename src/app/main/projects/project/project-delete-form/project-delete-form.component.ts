import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ProjectsService } from '../../../../shared/data-services/projects.service';


@Component({
  selector: 'app-project-delete-form',
  templateUrl: './project-delete-form.component.html',
})
export class ProjectDeleteFormComponent implements OnInit {

	public deleteProjectForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private projectCtrl: ProjectsService,
		private notifier: NotifierService,
		public router: Router,
	) { }

  	ngOnInit(): void {
		this.deleteProjectForm = this.fb.group({
			confirmDelete: ['', Validators.required ] // Validators.pattern('I want to delete my account')
		});
  	}

	public submitDeleteProjectForm(): void {
		if (this.deleteProjectForm.invalid) {
			this.deleteProjectForm.setErrors({message: 'Please fill in the security quote.'});
			return;
		}
		this.projectCtrl.delete('projectId').subscribe( res => {
			console.log('PROJECT DELETE ACTION IS WIP', res);
			this.notifier.notify('success', `Project was deleted successfully`);
			this.router.navigate(['/projects']);
		});
	}

}
