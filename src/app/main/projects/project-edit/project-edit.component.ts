import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {forkJoin, Observable} from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { StorageService } from '../../../shared/services/storage.service';
import { FilesService } from '../../../shared/data-services/files.service';
import { IFile } from '../../../shared/interfaces/IFile';
import { ILink } from '../../../shared/interfaces/ILink';


@Component({
	selector: 'app-project-edit',
	templateUrl: './project-edit.component.html'
})
export class ProjectEditComponent implements OnInit {

	public file: IFile;

	public links: ILink[] = [];
	public showLinks = false;

	constructor(
		public storage: StorageService,
		public router: Router,
		public filesCtrl: FilesService,
		private notifier: NotifierService
	) { }

	ngOnInit() {
		this.setActiveFile(this.storage.load('activeFile'));
	}

	public saveSingleChangeLocally(event): void {

		// TODO: modify event.x1 event.y1 etc so that x1<x2 && y1<y2, to guarantee a uniform link storage

		console.log(event);

		const activeLinks = this.storage.load('activeLinks');
		activeLinks.push(event);
		this.storage.store('activeLinks', activeLinks);
		this.notifier.notify('success', 'Link added.');

		// Σε αυτο το σημείο (χρονικα) ότι βρίσκεται μέσα στο storage.activeLinks πρέπει να σωθεί και στην firebase.
		// Το save στη firebase θα γίνεται όταν πατήσω συγκεκριμ'ενο κουμπί.
		// Τα data που θα γινονται save στη firebase θα βρίσκονται στο storage.
		// Μετα το save τα data που σωθηκαν θα σβήνονται απο το storage. - OK

		// Αν ο χρήστης προσπαθήσει να αλλάξει active file χωρις να εχει κανει save τοτε
		// πρέπει να παιρνει καποιο confirmation alert. - NOT YET DONE

	}


	public onToggleLinks(): void {
		this.showLinks = !this.showLinks;
	}

	public onSaveChanges(): void {
		const activeLinks = this.storage.load('activeLinks');
		const linksToSave: any[] = [];

		activeLinks.forEach( link => {
			if (link.id) {
				return;
			}
			linksToSave.push( this.filesCtrl.saveFileLink(link) );
		});

		forkJoin(linksToSave).subscribe(
			res => {
				this.notifier.notify('success', 'File links were saved successfully!');
			},
			err => {
				console.error('onSaveChanges error', err);
				this.notifier.notify('error', `${err.message}`);
			}
		);

	}

	public onChangeActiveFile(file): void {
		this.setActiveFile(file);
	}

	private setActiveFile(file: IFile) {
		this.file = file;
		this.storage.store('activeFile', file);

		this.filesCtrl.getFileLinks(this.file.id).subscribe(
			res => {
				this.links = res;
				this.storage.store('activeLinks', this.links)
			},
			error => {
				console.log('links error' , error)
				this.links = [];
				this.storage.store('activeLinks', this.links)
			}
		);
	}

}
