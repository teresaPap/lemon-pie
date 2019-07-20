import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';


@Component({
	selector: 'app-library',
	templateUrl: './library.component.html',
	styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {

	public projects;

	constructor( private apiService: ApiService ) { }

	ngOnInit() {
		this.apiService.getProjects().subscribe();
	}


}
