import { Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'app-button-toggle',
	templateUrl: './button-toggle.component.html'
})
export class ButtonToggleComponent {

	@Output('onClick') onClick: EventEmitter<boolean> = new EventEmitter<boolean>();

	public isToggleOn: boolean = false;

	constructor() { }

	public toggle() {
		this.isToggleOn = !this.isToggleOn;
		this.onClick.emit(this.isToggleOn);
	}

}
