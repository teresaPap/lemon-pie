import { Component, OnInit } from '@angular/core';

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
export class LinkerComponent implements OnInit {

	constructor() { }

	ngOnInit() {
	}



}
