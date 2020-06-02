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

  	constructor(
		private route: ActivatedRoute,
		private fileCtrl: FilesService
	) { }

  	ngOnInit(): void {
		const resolvedData: IProjectResolved = this.route.parent.snapshot.data['resolvedData'];
		const files: IFile[] = resolvedData.files;

		console.log(files);
  	}

}
