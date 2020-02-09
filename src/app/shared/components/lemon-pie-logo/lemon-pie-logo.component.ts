import { Component } from '@angular/core';

@Component({
	selector: 'app-lemon-pie-logo',
	template: `
        <div class="logo">
            <div class="lemon-petal"></div>
            <div class="lemon-petal"></div>
            <div class="lemon-petal"></div>
            <div class="lemon-petal"></div>
            <div class="lemon-petal"></div>
        </div>
	`,
	styles: ['']
})
export class LemonPieLogoComponent {
	constructor() { }
}
