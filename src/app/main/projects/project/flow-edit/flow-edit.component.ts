import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute } from '@angular/router';
import { FilesService } from '../../../../shared/data-services/files.service';
import { IFile } from '../../../../shared/interfaces/IFile';
import { ICanvasSelection, IClickableArea } from '../../../../shared/interfaces/ILink';
import { LinksService } from "../../../../shared/data-services/links.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-flow-edit',
  templateUrl: './flow-edit.component.html',
})
export class FlowEditComponent implements OnInit {

	private selectedArea: ICanvasSelection;

	public files: IFile[] = [];
	public activeFile: IFile;

	public showSelectionMenu: boolean = false;
	public linkToFileForm: FormGroup;


	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private fileCtrl: FilesService,
		private linkCtrl: LinksService,
		private notifier: NotifierService,
	) {
		this.linkToFileForm = this.fb.group({
			fileId: ['', Validators.required]
		});
	}

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

	public saveLink(): void {
		const newLink: IClickableArea = {
			...this.selectedArea,
			destinationFileId: this.linkToFileForm.controls['fileId'].value };

		console.log('File to update', this.activeFile, newLink);

		this.linkCtrl.create(newLink, this.activeFile.id).subscribe(
			res => {
				console.log(res);
				this.closeSelectionMenu();
			}
		);
	}

	public closeSelectionMenu(): void {
		this.showSelectionMenu = false;
	}

	public toggleLinkVisibility() {
		console.log('TODO: toggle Link Visibility');
	}

}
