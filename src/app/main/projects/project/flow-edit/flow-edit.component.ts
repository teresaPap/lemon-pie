import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { FilesService } from '../../../../shared/data-services/files.service';
import { IFile } from '../../../../shared/interfaces/IFile';
import { ICanvasSelection, IClickableArea, ILink } from '../../../../shared/interfaces/ILink';
import { LinksService } from '../../../../shared/data-services/links.service';
import { EditorComponent } from '../../../../shared/components/editor/editor.component';

@Component({
  selector: 'app-flow-edit',
  templateUrl: './flow-edit.component.html',
})
export class FlowEditComponent implements OnInit, OnDestroy {

	@ViewChild(EditorComponent) private editorComponent: EditorComponent;

	private fileChangesListener: Subscription;
	private linkChangesListener: Subscription;

	private selectedArea: ICanvasSelection;

	public files: IFile[] = [];
	public activeFile: IFile;
	public linksOnActiveFile: ILink[];

	public showSelectionMenu: boolean = false;
	public showLinksOnActiveFile: boolean = false;

	public linkToFileForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private fileCtrl: FilesService,
		private linkCtrl: LinksService,
		private notifier: NotifierService,
	) {
		this.linkToFileForm = this.fb.group({
			fileId: ['', Validators.required]
		});
	}

	ngOnInit(): void {
		this.fileChangesListener = this.fileCtrl.activeFilesListChanges$.subscribe( (filesList: IFile[]) => {
			this.files = filesList;
		});

		this.linkChangesListener = this.linkCtrl.activeLinkListChanges$.subscribe( (linkList: ILink[]) => {
			this.linksOnActiveFile = linkList;
		});
	}

	ngOnDestroy(): void {
		this.fileChangesListener.unsubscribe();
		this.linkChangesListener.unsubscribe();
	}

	public changeActiveFile(file: IFile) {
		this.activeFile = file;
		this.linkCtrl.readAllLinks(this.activeFile.id).subscribe();
		this.selectedArea = null;
		this.showLinksOnActiveFile = false;
	}

	public areaSelected(area: ICanvasSelection) {
		this.selectedArea = area;
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
		this.editorComponent.clearCanvas();
	}

	public toggleLinkVisibility():void {
		this.showLinksOnActiveFile = !this.showLinksOnActiveFile;
	}

}
