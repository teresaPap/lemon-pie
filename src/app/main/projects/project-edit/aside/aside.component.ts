import { Component, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-aside',
	templateUrl: './aside.component.html'
})
export class AsideComponent {
	@Output('onShowLinks') onShowLinks: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor() { }

	public showLinks(event) {
		this.onShowLinks.emit(event);
	}
}

