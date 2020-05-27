import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {IProjectResolved} from "../../../shared/interfaces/IProject";

@Component({
	selector: 'app-project',
  	templateUrl: './project.component.html'
})
export class ProjectComponent implements OnInit {

   	constructor(
   		private route: ActivatedRoute
	) { }

   	ngOnInit(): void {
		const resolvedData: IProjectResolved = this.route.snapshot.data['resolvedData'];
		console.log(resolvedData);
  	}

}
