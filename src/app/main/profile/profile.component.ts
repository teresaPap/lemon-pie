import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
		public router: Router,
	) { }

	ngOnInit() {
		this.userDetailForm = this.fb.group({
			username: '',
			email: {value: '', disabled: true},
			role: '',
			projectsCount: {value: null, disabled: true},
		});

		this.changePasswordForm = this.fb.group({
			oldPassword: ['', Validators.required],
			password: ['', [Validators.required, Validators.minLength(6)] ],
			confirmPassword: ['']
		},  { validator: CustomValidators.comparePasswords });

		this.deleteAccountForm = this.fb.group({
			confirmDelete: ['', [Validators.required, Validators.pattern('I want to delete my account')]]
		});

		this.userCtrl.readCurrentUser().subscribe((currentUser: IUser) => {
			// TODO: use route resolver instead
			this.userDetailForm.controls['username'].setValue(currentUser.username);
			this.userDetailForm.controls['email'].setValue(currentUser.email);
			this.userDetailForm.controls['role'].setValue(currentUser.role);
			this.userDetailForm.controls['projectsCount'].setValue(currentUser.references? currentUser.references.length : 0);
		});
	}

	public submitUserDetailForm(): void {
		if (this.userDetailForm.valid && !this.userDetailForm.pristine) {
			this.userCtrl.updateCurrentUser({
				username: this.userDetailForm.controls['username'].value,
				role: this.userDetailForm.controls['role'].value
			}).subscribe(
				() => {
					this.notifier.notify('success', `User details updated successfully.`);
					this.userDetailForm.markAsPristine();
				},
				err => {
					this.notifier.notify('error', `Error! ${err.message}`);
					console.log(err);
				}
			)
		}
	}

	public submitChangePasswordForm(): void {
		if (this.changePasswordForm.valid && !this.changePasswordForm.pristine) {
			this.userCtrl.updateCurrentUserPassword(this.changePasswordForm.controls['password'].value).subscribe(
				() => 	{
					this.notifier.notify('default', 'Password was updated successfully.');
					this.changePasswordForm.markAsPristine();
				},
				err => {
					this.notifier.notify('error', `${err.message}`);
					console.error(err);
				}
			);
		}
	}

	public submitDeleteAccountForm(): void {
		if (this.deleteAccountForm.valid && !this.deleteAccountForm.pristine) {
			this.userCtrl.deleteCurrentUser().subscribe(
				() => {
					this.notifier.notify('default', 'Account was deleted successfully.');
					this.router.navigate(['/home']);
				}, err => {
					this.notifier.notify('error', `${err.message}`);
					console.error(err);
				}
			)
		}
	}

	public logout(): void {
		this.userCtrl.logout().subscribe(
			() => this.router.navigate(['/home']),
			err => {
				this.notifier.notify('error', `${err.message}`);
				console.error(err);
			}
		);
	}

}
