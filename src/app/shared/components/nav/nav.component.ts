import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';


@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
})
export class NavComponent implements OnChanges {

	@Input() currentUser: string|null ;

	constructor(
		public router: Router) { }

	ngOnChanges(changes: SimpleChanges) {
		if (changes.currentUser) {
			this.currentUser = changes.currentUser.currentValue;
		}
	}

}
