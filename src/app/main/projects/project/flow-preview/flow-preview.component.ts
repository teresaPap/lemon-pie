import { Component, OnInit } from '@angular/core';
import {IFile} from "../../../../shared/interfaces/IFile";
import {ILink} from "../../../../shared/interfaces/ILink";
import {FilesService} from "../../../../shared/data-services/files.service";
import {LinksService} from "../../../../shared/data-services/links.service";

@Component({
  selector: 'app-flow-preview',
  templateUrl: './flow-preview.component.html'
})
export class FlowPreviewComponent implements OnInit {

	public files: IFile[] = [];
	public activeFile: IFile;
	public linksOnActiveFile: ILink[];

	constructor(
		private fileCtrl: FilesService,
		private linkCtrl: LinksService,
	) { }

  	ngOnInit(): void {
		this.fileCtrl.activeFilesListChanges$.subscribe( (filesList: IFile[]) => {
			this.files = filesList;
		});

		this.linkCtrl.activeLinkListChanges$.subscribe( (linkList: ILink[]) => {
			this.linksOnActiveFile = linkList;
			console.log('links changed', this.linksOnActiveFile)
		});

		console.log(this.files);
		this.changeActiveFile(this.files[0].id);
  	}

	public changeActiveFile(fileId: string) {
		console.log(fileId);

		if (!fileId) return;
		this.activeFile = this.files.find(elem => elem.id = fileId);
		this.linkCtrl.readAllLinks(this.activeFile.id).subscribe();
	}

}
