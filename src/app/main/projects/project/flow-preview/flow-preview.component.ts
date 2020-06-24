import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IFile } from '../../../../shared/interfaces/IFile';
import { ILink } from '../../../../shared/interfaces/ILink';
import { FilesService } from '../../../../shared/data-services/files.service';
import { LinksService } from '../../../../shared/data-services/links.service';

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

		if (this.files.length>0) {
			this.changeActiveFile(this.files[0].id);
			this.linkCtrl.readAllLinks(this.files[0].id).subscribe();
		}
  	}

	ngOnDestroy(): void {
		this.fileChangesListener.unsubscribe();
		this.linkChangesListener.unsubscribe();
	}

	public changeActiveFile(destinationFileId: string) {

		if (!destinationFileId) {
			console.log('\nUser clicked on a non clickable area.')
			return;
		}

		this.activeFile = this.files.find(elem => elem.id === destinationFileId);


	}

}
