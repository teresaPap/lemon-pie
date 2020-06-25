import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../shared/data-services/users.service';
import { IUser } from '../../shared/interfaces/IUser';
import { CustomValidators } from '../../shared/custom-validators';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {

	public currentUser: IUser;
	public userDetailForm: FormGroup;
	public changePasswordForm: FormGroup;
	public deleteAccountForm: FormGroup;


	constructor(
		private userCtrl: UsersService,
		private fb: FormBuilder,
	) { }

	ngOnInit() {
		this.userDetailForm = this.fb.group({
			username: {value: '', disabled: true},
			email: {value: '', disabled: true},
			role: {value: '', disabled: true},
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


		this.userCtrl.readCurrentUser().subscribe(
			(currentUser: IUser) => {
				this.currentUser = currentUser;
				console.log('currentUser:', currentUser);
			}
		);

		this.userCtrl.read().subscribe(
			(currentUser: IUser) => {
				this.currentUser = currentUser;
				console.log('currentUser:', currentUser);
				this.userDetailForm.controls['username'].setValue(currentUser.username);
				this.userDetailForm.controls['email'].setValue(currentUser.email);
				this.userDetailForm.controls['role'].setValue(currentUser.role);
				this.userDetailForm.controls['projectsCount'].setValue(currentUser.references.length);
			}
		);
	}

	public saveUserDetailForm() {
		return;
	}

	public saveChangePasswordForm() {
		return;
	}

	public submitDeleteAccountForm() {
		return;
	}


}
