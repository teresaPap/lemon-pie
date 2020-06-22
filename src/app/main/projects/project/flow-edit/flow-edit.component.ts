import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute } from '@angular/router';
import { FilesService } from '../../../../shared/data-services/files.service';
import { IFile } from '../../../../shared/interfaces/IFile';
import {ICanvasSelection, IClickableArea} from '../../../../shared/interfaces/ILink';

@Component({
  selector: 'app-flow-edit',
  templateUrl: './flow-edit.component.html',
})
export class FlowEditComponent implements OnInit {

	private selectedArea: ICanvasSelection;

	public files: IFile[] = [];
	public activeFile: IFile = {} as IFile;

	public showSelectionMenu: boolean = false;

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
		this.selectedArea = null;
	}

	public areaSelected(area: ICanvasSelection) {
		console.log('Area', area);
		this.selectedArea = area;
		// show selection menu
		this.showSelectionMenu = true;
	}

	public saveLink(fileId) {
		const newLink: IClickableArea = { ...this.selectedArea, destinationFileId: fileId };

		console.log('File to update', this.activeFile );
		// this.fileCtrl.update(this.activeFile.id, {links})
	}

	public closeSelectionMenu(): void {
		this.showSelectionMenu = false;
	}


}
