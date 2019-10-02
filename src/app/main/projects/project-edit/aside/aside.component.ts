import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-aside',
	templateUrl: './aside.component.html'
})
export class AsideComponent implements OnInit {

	@Output('onShowLinks') onShowLinks: EventEmitter<boolean> = new EventEmitter<boolean>();

	public expandMenu: boolean;
	public showLinksTrue: boolean = false;

	constructor() { }

	ngOnInit() {
	}

	public toggleAsideMenu() {
		this.expandMenu = !this.expandMenu;
	}

	public showLinks() {
		this.showLinksTrue = !this.showLinksTrue;
		this.onShowLinks.emit(true);
	}

}

