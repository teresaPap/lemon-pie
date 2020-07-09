import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
	@ViewChild('editFlowMenu') public editFlowMenu: ElementRef;

	private fileChangesListener: Subscription;
	private linkChangesListener: Subscription;

	private selectedArea: ICanvasSelection;

	public files: IFile[] = [];
	public activeFile: IFile;
	public linksOnActiveFile: ILink[];

	public showSelectionMenu: boolean = false;
	public linksOnActiveVisible: boolean = false;
	public showEditLinkMenu: boolean = false;
	public isFileNavMini: boolean = false;

	public createLinkForm: FormGroup;
	public editLinkForm: FormGroup;
	public selectedLink: ILink;

	constructor(
		private fb: FormBuilder,
		private fileCtrl: FilesService,
		private linkCtrl: LinksService,
		private notifier: NotifierService,
	) {
		this.createLinkForm = this.fb.group({
			fileId: ['', Validators.required]
		});
		this.editLinkForm = this.fb.group({
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

		if (this.selectedArea) {
			this.selectedArea = null;
			this.closeCreateLinkMenu();
		}
		this.linksOnActiveVisible = false;
	}

	public toggleLinkVisibility():void {
		this.linksOnActiveVisible = !this.linksOnActiveVisible;
		if (this.linksOnActiveVisible) {
			this.closeCreateLinkMenu();
		} else {
			this.closeEditLinkMenu()
		}
	}

	public toggleMenuSize(): void {
		this.isFileNavMini = !this.isFileNavMini;
		if ( this.isFileNavMini ) {
			this.editFlowMenu.nativeElement.classList.add('minified');
		} else {
			this.editFlowMenu.nativeElement.classList.remove('minified');
		}
	}


	// #region - Create Link

	public onCreateLinkSubmit(): void {
		const newLink: IClickableArea = {
			...this.selectedArea,
			destinationFileId: this.createLinkForm.controls['fileId'].value };
		this.createLinkForm.reset();

		this.linkCtrl.create(newLink, this.activeFile.id).subscribe(
			res => {
				console.log(res);
				this.closeCreateLinkMenu();
				this.notifier.notify('success', `A link on '${this.activeFile.name}' was created successfully.`);
			},
			err => {
				console.log(err);
				this.closeCreateLinkMenu();
				this.notifier.notify('error', `Error: ${err.message}`);
			}
		);
	}

	public closeCreateLinkMenu(): void {
		this.showSelectionMenu = false;
		this.createLinkForm.reset();
		this.editorComponent.clearCanvas();
	}

	public areaSelected(area: ICanvasSelection) {
		this.selectedArea = area;
		this.showSelectionMenu = true;
	}

	// #endregion


	// #region - Edit Link

	public onEditLinkSubmit(): void {
		console.log('edit link submitted');
		this.linkCtrl.update( this.selectedLink.id ,{ ...this.selectedLink, destinationFileId: this.editLinkForm.controls['fileId'].value}).subscribe(
			res => {
				this.closeEditLinkMenu();
				this.notifier.notify('success', `Link was edited successfully.`);
			},
			err => {
				this.closeEditLinkMenu();
				this.notifier.notify('error', `Error: ${err.message}`);
			}
		);
	}

	public deleteLink(): void {
		this.linkCtrl.delete(this.selectedLink.id, this.activeFile.id).subscribe(
			res => {
				this.editorComponent.unStrokeSelectedLink(this.selectedLink);
				this.closeEditLinkMenu();
				this.notifier.notify('success', `Link was deleted successfully.`);
			},
			err => {
				this.closeEditLinkMenu();
				this.notifier.notify('error', `Error: ${err.message}`);
			}
		)
	}

	public closeEditLinkMenu(): void {
		this.editorComponent.unStrokeSelectedLink(this.selectedLink);
		this.showEditLinkMenu = false;
		this.editLinkForm.reset();
	}

	public linkAreaClicked(link: ILink): void {
		if (!link) {
			return;
		}
		this.selectedLink = link;
		this.editorComponent.strokeSelectedLink(link);
		this.showEditLinkMenu = true;
	}


	// #endregion



}
