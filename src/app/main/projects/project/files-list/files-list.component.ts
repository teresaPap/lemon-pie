import { Component, OnInit } from '@angular/core';
import { FilesService} from "../../../../shared/data-services/files.service";
import { IProjectResolved} from "../../../../shared/interfaces/IProject";
import { ActivatedRoute} from "@angular/router";
import {IFile} from "../../../../shared/interfaces/IFile";
import {NotifierService} from "angular-notifier";

@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
})
export class FilesListComponent implements OnInit {

	public files: IFile[] = [];

  	constructor(
		private route: ActivatedRoute,
		private fileCtrl: FilesService,
		private notifier: NotifierService,
	) { }

  	ngOnInit(): void {
		const resolvedData: IProjectResolved = this.route.parent.snapshot.data['resolvedData'];
		this.files = resolvedData.files;

		console.log(this.files);
  	}

	public deleteFile(fileId: string): void {
		const resolvedData: IProjectResolved = this.route.parent.snapshot.data['resolvedData'];
		const projectId = resolvedData.project.id;

  		this.fileCtrl.delete(fileId, projectId).subscribe(
  			res => {
  				console.log(res);
				this.notifier.notify('success', `Project was deleted successfully`);
			}, err => {
				console.error(err);
				this.notifier.notify('error', `Something went wrong. ${err.message}`);
			}
		)
	}

}
