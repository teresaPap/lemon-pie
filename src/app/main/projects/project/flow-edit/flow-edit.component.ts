import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute } from '@angular/router';
import { FilesService } from '../../../../shared/data-services/files.service';
import { IFile } from '../../../../shared/interfaces/IFile';

@Component({
  selector: 'app-flow-edit',
  templateUrl: './flow-edit.component.html',
})
export class FlowEditComponent implements OnInit {

	public files: IFile[] = [];
	public activeFile: IFile = {} as IFile;

	constructor(
		private route: ActivatedRoute,
		private fileCtrl: FilesService,
		private notifier: NotifierService,
	) { }

	ngOnInit(): void {
		this.fileCtrl.activeFilesListChanges$.subscribe( (filesList: IFile[]) => {
			this.files = filesList;
		});
	}

	public changeActiveFile(file: IFile) {
		this.activeFile = file;
	}

}
