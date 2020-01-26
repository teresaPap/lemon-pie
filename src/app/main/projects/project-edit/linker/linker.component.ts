import { Component, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IClickableArea } from '../../../../shared/interfaces/IFile';
import { CanvasService } from '../../../../shared/services/canvas.service';

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

	@ViewChild('canvas', { static: false }) public canvas: ElementRef;
	private cx: CanvasRenderingContext2D;
	private linker: HTMLCanvasElement;

	constructor(private canvasCtrl: CanvasService) { }

	ngAfterViewInit(): void {
		// get the context
		this.linker = this.canvas.nativeElement;
		this.cx = this.linker.getContext('2d');

		// set up the canvas
		this.setSize(this.imgUrl).subscribe(
			() => {
				if (this.clickableAreas.length) {
					this.draw();
				}
			}
		);

	}

	private draw() {
		this.canvasCtrl.setStrokeStyle(this.cx, '#b3d4fc' );
		this.clickableAreas.forEach(area => {
			console.log(`draw: (${area.x1}, ${ area.y1}) (${area.x2}, ${area.y2})`);

			const startingPos = { x: area.x1, y: area.y1 };
			const finalPos = { x: area.x2, y: area.y2 };

			this.canvasCtrl.drawRectangle(startingPos, finalPos, this.cx);
		});
	}

	private setSize(url): Observable<void> {
		const img = new Image;
		img.src = url;
		return this.canvasCtrl.getSizeFromImage(img).pipe(
			tap( dimentions => {
				console.log(dimentions);
				this.linker.height = dimentions.height;
				this.linker.width = dimentions.width;
			})
		);
	}

}
