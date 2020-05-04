import { Component, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import {Subscription, of, from } from 'rxjs';
import { CanvasService } from '../../../../shared/services/canvas.service';
import { IClickableArea } from "../../../../shared/interfaces/ILink";

// COMPONENT DESCRIPTION:
// LinkerComponent is an Identical Canvas with the Editor component which will be displayed
// on top of the editor canvas whenever the show links toggle button is on.
// On LinkerComponent canvas element there will be drawn all the link components that have
// been previously drawn using the editor component.
// Whenever LinkerComponent is visible the EditorComponent is inactive,
// the user cannot click on it or create new clickable areas

// LinkerComponent will have modes: display and play.
// In display mode the links will only be visible.
// In play mode they will be clickable as well.

@Component({
	selector: 'app-linker',
	templateUrl: './linker.component.html'
})
export class LinkerComponent implements AfterViewInit {

	@Input() imgUrl: string;
	@Input() clickableAreas?: IClickableArea[];

	@ViewChild('canvas') public canvas: ElementRef;
	private cx: CanvasRenderingContext2D;
	private linker: HTMLCanvasElement;

	constructor(private canvasCtrl: CanvasService) { }

	ngAfterViewInit(): void {
		// get the context
		this.linker = this.canvas.nativeElement;
		this.cx = this.linker.getContext('2d');

		// set up the canvas
		this.setSize(this.imgUrl).add(this.drawSavedAreas());
	}

	private drawSavedAreas(): Subscription {
		CanvasService.setStrokeStyle(this.cx);
		console.log(`Clickable Areas found: ${this.clickableAreas.length}`);

		const rectanglesFromClickableAreas = this.clickableAreas.map(area => {
			console.log(`draw: (${area.x1}, ${ area.y1}) (${area.x2}, ${area.y2})`);

			const startingPos = { x: area.x1, y: area.y1 };
			const finalPos = { x: area.x2, y: area.y2 };

			return from( CanvasService.drawRectangle(startingPos, finalPos, this.cx) );
		});

		console.log(rectanglesFromClickableAreas);

		// TODO: this return works properly, most probably.
		// before trying to solve the return problem, make sure there is no problem in linker canvas
		// I thing that trying to draw a hardcoded
		// rectangle in linker canvas does not work as well as by using the link data from firebase.
		return of(rectanglesFromClickableAreas).subscribe();

	}

	private setSize(url): Subscription {
		const img = new Image;
		img.src = url;
		return this.canvasCtrl.getSizeFromImage(img).subscribe(
			dimensions => {
				this.linker.height = dimensions.height;
				this.linker.width = dimensions.width;
			});
	}

}
