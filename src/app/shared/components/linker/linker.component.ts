import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, OnChanges } from '@angular/core';
import { IClickableArea } from '../../interfaces/IFile';
import { ICanvasPosition } from '../../interfaces/IEditor';

// COMPONENT DESCRIPTION: 
// LinkerComponent is an Identical Canvas with the Editor component which will be displayed on top of the editor canvas whenever the show links toggle button is on. 
// On LinkerComponent canvas element ther will be drawn all the link components that have been previously drawn using the editor component. 
// Whenever LinkerComponent is visible the EditorComponent is inavtive - the user cannot click on it or create new clickable areas

// LinkerComponent will have modes: display and play. 
// In display mode the links will only be visible.
// In play mode they will be clickable as well. 

@Component({
	selector: 'app-linker',
	templateUrl: './linker.component.html'
})
export class LinkerComponent implements OnInit, AfterViewInit, OnChanges {

	@Input() clickableAreas?: IClickableArea[];

	@ViewChild('canvas', { static: false }) public canvas: ElementRef;
	private cx: CanvasRenderingContext2D;
	private linker: HTMLCanvasElement;

	constructor() { }

	ngOnInit(): void {
	}

	ngAfterViewInit(): void {
		// get the context
		this.linker = this.canvas.nativeElement;
		this.cx = this.linker.getContext('2d');
		this.setStrokeStyle();
	}

	ngOnChanges() {
		console.log('Linker changed', this.clickableAreas.length);
		if (this.clickableAreas.length)
			this.clickableAreas.forEach(area => {
				const { x1, x2, y1, y2 } = area;

				this.drawRectangle(x1, x2, y1, y2);
			});
	}

	private async drawRectangle(x1: number, y1: number, x2: number, y2: number) {
		console.log(x1, y1, x2, y2)
		const width: number = x2 - x1;
		const height: number = y2 - y1;

		this.cx.rect(x1, y1, width, height);
		this.cx.stroke();
	}


	private setStrokeStyle() {
		// TODO: maybe create a panel for user to set the style
		this.cx.lineWidth = 2;
		this.cx.lineCap = 'round';
		this.cx.strokeStyle = '#ff812d';
	}


}
