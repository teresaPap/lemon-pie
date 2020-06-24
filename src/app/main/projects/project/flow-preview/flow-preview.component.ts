import {Component, OnDestroy, OnInit} from '@angular/core';
import { IFile } from '../../../../shared/interfaces/IFile';
import { ILink } from '../../../../shared/interfaces/ILink';
import { FilesService } from '../../../../shared/data-services/files.service';
import { LinksService } from '../../../../shared/data-services/links.service';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-flow-preview',
  templateUrl: './flow-preview.component.html'
})
export class FlowPreviewComponent implements OnInit, OnDestroy {

	private fileChangesListener: Subscription;
	private linkChangesListener: Subscription;

	public files: IFile[] = [];
	public activeFile: IFile;
	public linksOnActiveFile: ILink[];

	constructor(
		private fileCtrl: FilesService,
		private linkCtrl: LinksService,
	) { }

  	ngOnInit(): void {
		this.fileChangesListener = this.fileCtrl.activeFilesListChanges$.subscribe( (filesList: IFile[]) => {
			this.files = filesList;
		});

		this.linkChangesListener = this.linkCtrl.activeLinkListChanges$.subscribe( (linkList: ILink[]) => {
			this.linksOnActiveFile = linkList;
		});

		this.changeActiveFile(this.files[0].id);
  	}

	ngOnDestroy(): void {
		this.fileChangesListener.unsubscribe();
		this.linkChangesListener.unsubscribe();
	}

	public changeActiveFile(fileId: string) {
		console.log(fileId);

		if (!fileId) return;
		this.activeFile = this.files.find(elem => elem.id = fileId);
		this.linkCtrl.readAllLinks(this.activeFile.id).subscribe();
	}

}
