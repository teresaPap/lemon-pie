import { Component, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-aside',
	templateUrl: './aside.component.html'
})
export class AsideComponent {
	@Output('onShowLinks') onShowLinks: EventEmitter<boolean> = new EventEmitter<boolean>();
	public showLinksTrue: boolean = false;

	constructor() { }

	public showLinks() {
		this.showLinksTrue = !this.showLinksTrue;
		this.onShowLinks.emit(this.showLinksTrue);
	}
}

