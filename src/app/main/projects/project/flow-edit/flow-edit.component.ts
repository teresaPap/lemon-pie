import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { FilesService } from '../../../../shared/data-services/files.service';
import { IFile } from '../../../../shared/interfaces/IFile';
import { ICanvasSelection, IClickableArea, ILink } from '../../../../shared/interfaces/ILink';
import { LinksService } from '../../../../shared/data-services/links.service';

@Component({
  selector: 'app-flow-edit',
  templateUrl: './flow-edit.component.html',
})
export class FlowEditComponent implements OnInit {

	private selectedArea: ICanvasSelection;

	public files: IFile[] = [];
	public activeFile: IFile;
	public linksOnActiveFile: ILink[];

	public showSelectionMenu: boolean = false;
	public showLinksOnActiveFile: boolean = false;

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

		this.linkCtrl.activeLinkListChanges$.subscribe( (linkList: ILink[]) => {
			this.linksOnActiveFile = linkList;
		});
	}

	public changeActiveFile(file: IFile) {
		this.activeFile = file;
		this.linkCtrl.readAllLinks(this.activeFile.id).subscribe();
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

		this.linkCtrl.create(newLink, this.activeFile.id).subscribe(
			res => {
				console.log(res);
				this.closeSelectionMenu();
				this.notifier.notify('success', 'Link was saved successfully.');
			},
			err => {
				console.log(err);
				this.closeSelectionMenu();
				this.notifier.notify('error', `Error: ${err.message}`);
			}
		);
	}

	public closeSelectionMenu(): void {
		this.showSelectionMenu = false;
	}

	public toggleLinkVisibility():void {
		this.showLinksOnActiveFile = !this.showLinksOnActiveFile;
	}

}
