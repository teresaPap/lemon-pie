import { Component, OnInit } from '@angular/core';
import { FilesService} from "../../../../shared/data-services/files.service";
import { IProjectResolved} from "../../../../shared/interfaces/IProject";
import { ActivatedRoute} from "@angular/router";
import {IFile} from "../../../../shared/interfaces/IFile";

@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
})
export class FilesListComponent implements OnInit {

	public files: IFile[] = [];

  	constructor(
		private route: ActivatedRoute,
		private fileCtrl: FilesService
	) { }

  	ngOnInit(): void {
		const resolvedData: IProjectResolved = this.route.parent.snapshot.data['resolvedData'];
		this.files = resolvedData.files;

		console.log(this.files);
  	}

}
