import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


// PAGE DESCRIPTION: 
// In this view the user can select a file and open the file editor view (to be developed). 


@Component({
	selector: 'app-project-edit',
	templateUrl: './project-edit.component.html'
})
export class ProjectEditComponent implements OnInit {

	constructor( 
		private route: ActivatedRoute,
		) { }

	ngOnInit() {
		// this.route.params.subscribe( params => {
		// 	console.log("Edidting project with id: " + params.id);
		// })
	}

	

}
