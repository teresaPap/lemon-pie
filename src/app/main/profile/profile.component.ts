import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { UsersService } from '../../shared/data-services/users.service';
import { IUser } from '../../shared/interfaces/IUser';
import { CustomValidators } from '../../shared/custom-validators';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {

	public userDetailForm: FormGroup;
	public changePasswordForm: FormGroup;
	public deleteAccountForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private userCtrl: UsersService,
		private notifier: NotifierService,
	) { }

	ngOnInit() {
		this.userDetailForm = this.fb.group({
			username: '',
			email: {value: '', disabled: true},
			role: '',
			projectsCount: {value: 0, disabled: true},
		});

		this.changePasswordForm = this.fb.group({
			oldPassword: ['', Validators.required],
			password: ['', Validators.required],
			confirmPassword: ['']
		},  { validator: CustomValidators.comparePasswords });

		this.deleteAccountForm = this.fb.group({
			confirmDelete: ['', Validators.pattern('I want to delete my account')]
		});

		this.userCtrl.readCurrentUser().subscribe((currentUser: IUser) => {
			// TODO: use route resolver instead
			console.log('currentUser:', currentUser);
			this.userDetailForm.controls['username'].setValue(currentUser.username);
			this.userDetailForm.controls['email'].setValue(currentUser.email);
			this.userDetailForm.controls['role'].setValue(currentUser.role);
			this.userDetailForm.controls['projectsCount'].setValue(currentUser.references.length);
		});
	}

	public submitUserDetailForm() {
		if (!this.userDetailForm.valid) {
			return;
		}
		this.userCtrl.updateCurrentUser({
			username: this.userDetailForm.controls['username'].value,
			role: this.userDetailForm.controls['role'].value
		}).subscribe(
			() => this.notifier.notify('success', `User details updated successfully!`),
			err => {
				this.notifier.notify('error', `Error! ${err.message}`);
				console.log(err);
			}
		)
	}

	public submitChangePasswordForm() {
		return;
	}

	public submitDeleteAccountForm() {
		return;
	}


}
