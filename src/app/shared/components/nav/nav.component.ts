import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';


@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
})
export class NavComponent implements OnChanges {

	@Input() currentUserId: string|null ;

	constructor(
		public router: Router) { }

	ngOnChanges(changes: SimpleChanges) {
		if (changes.currentUserId) {
			console.log('Current user changed: ', changes );
			this.currentUserId = changes.currentUserId.currentValue
		}
	}

}
