import { Component, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';

@Component({
	selector: 'app-aside',
	templateUrl: './aside.component.html'
})
export class AsideComponent {
	@Output('onShowLinks') onShowLinks: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor(
		private location: Location
	) { }

	public showLinks(event): void {
		this.onShowLinks.emit(event);
	}

	public navigateBack(): void {
		console.log('hello hello');
		this.location.back();
	}
}

