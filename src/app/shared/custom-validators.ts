import { AbstractControl } from '@angular/forms';

export class CustomValidators {
	static comparePasswords( control: AbstractControl ):  {[key: string]: any} | null {
		const password = control.get('password');
		const confirmPassword = control.get('confirmPassword');

		if ( password.pristine || confirmPassword.pristine ) { return null; }

		if ( password.value === confirmPassword.value) { return null; }

		return { 'comparePasswords': true };

	}
}
